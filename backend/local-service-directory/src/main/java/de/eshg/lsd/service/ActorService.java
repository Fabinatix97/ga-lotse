/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import com.google.common.util.concurrent.Striped;
import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.lib.servicedirectory.api.ActorRequestDto;
import de.eshg.lib.servicedirectory.api.CertificateDto;
import de.eshg.lib.servicedirectory.api.PostTopologyRequestDto;
import de.eshg.lsd.exception.InvalidCertificateException;
import de.eshg.lsd.keycloak.LsdKeycloakClient;
import de.eshg.lsd.properties.LsdProperties;
import de.eshg.lsd.register.api.ActorTypeDto;
import de.eshg.servicedirectory.util.X509Utils;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.Lock;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

@Service
public class ActorService {
  private static final Logger log = LoggerFactory.getLogger(ActorService.class);

  private final LsdKeycloakClient keycloakClient;

  private final SignatureService signatureService;

  private final ServiceDirectoryApi serviceDirectoryApi;

  private final LsdProperties config;

  private final Striped<Lock> stripedLock = Striped.lock(16);

  private final Map<String, HeartBeats> heartbeats = new ConcurrentHashMap<>();

  private final RetryTemplate retryTemplate =
      RetryTemplate.builder().maxAttempts(3).fixedBackoff(1000).retryOn(Exception.class).build();
  private final AtomicBoolean topologyUpdated = new AtomicBoolean(false);

  public ActorService(
      LsdKeycloakClient keycloakClient,
      SignatureService signatureService,
      ServiceDirectoryApi serviceDirectoryApi,
      LsdProperties config) {
    this.keycloakClient = keycloakClient;
    this.signatureService = signatureService;
    this.serviceDirectoryApi = serviceDirectoryApi;
    this.config = config;
  }

  public List<ActorRequestDto> getActors() {
    return keycloakClient.getRealm().users().list().stream()
        .map(this::getActorDtoOrNull)
        .filter(Objects::nonNull)
        .toList();
  }

  private ActorRequestDto getActorDtoOrNull(UserRepresentation user) {
    LsdAttributes attributes = new LsdAttributes(user);
    if (attributes.isEmpty()) {
      log.warn("user {} has no attributes", user.getUsername());
      return null;
    }

    String type = attributes.getType();
    String readableName = attributes.getReadableName();

    if (readableName == null) {
      log.warn("user {} has missing readableName", user.getUsername());
      return null;
    }

    if (type == null) {
      log.warn("user {} has missing type", user.getUsername());
      return null;
    }

    List<String> certificates = attributes.getCertificates();

    if (certificates.isEmpty()) {
      log.warn("user {} has no certificates", user.getUsername());
      return null;
    }

    String concatenatedCertificates = String.join("", certificates);

    return new ActorRequestDto(
        readableName,
        de.eshg.lib.servicedirectory.api.ActorTypeDto.valueOf(type),
        new CertificateDto(
            concatenatedCertificates,
            signatureService.sign(concatenatedCertificates),
            signatureService.getCertificate()));
  }

  @EventListener(ApplicationReadyEvent.class)
  void updateTopologyOnApplicationReadyEvent() {
    new Thread(this::retryUpdateTopology).start();
  }

  private void retryUpdateTopology() {
    retryTemplate.execute(
        context -> {
          if (!topologyUpdated.get()) {
            updateTopology();
          }
          return null;
        },
        context -> {
          log.error("Initial topology update failed", context.getLastThrowable());
          return null;
        });
  }

  public synchronized void updateTopology() {
    PostTopologyRequestDto request = new PostTopologyRequestDto(getActors());
    if (!request.actorsRequest().isEmpty()) {
      log.info(
          "Posting topology for actors: {}",
          request.actorsRequest().stream().map(ActorService::getActorInfo).toList());
      serviceDirectoryApi.postTopology(request);
    } else {
      log.info("Not posting topology, no actors found");
    }
    topologyUpdated.set(true);
  }

  public void updateActor(ActorTypeDto type, String certPem, String userName, String readableName) {

    log.info("Received actor update: {}", X509Utils.getCertificateInfo(readableName, certPem));
    X509Certificate cert = X509Utils.parsePem(certPem);
    if (X509Utils.isCaCertificate(cert)) {
      throw new InvalidCertificateException("CA certificate not allowed");
    }
    String commonName = X509Utils.extractCommonName(cert);
    if (!commonName.equals(userName)) {
      throw new InvalidCertificateException(commonName, userName);
    }

    String location = X509Utils.extractLocation(cert);
    if (location == null) {
      log.warn("Received actor update without location for {}", commonName);
    }
    heartbeat(commonName, location);

    Lock lock = stripedLock.get(commonName);
    try {
      lock.lock();

      UserResource userResource = keycloakClient.getUserByNameOrThrow(commonName);
      UserRepresentation userRepresentation = userResource.toRepresentation();

      LsdAttributes attributes =
          new LsdAttributes(
              userRepresentation, type, readableName, commonName, heartbeats.get(commonName));

      attributes.update(certPem, config.maxCertificatesPerActor());

      userResource.update(userRepresentation);
    } finally {
      lock.unlock();
    }
  }

  public void heartbeat(String commonName, String location) {
    log.debug("Recording heartbeat from {}:{}", commonName, location);
    heartbeats.computeIfAbsent(commonName, k -> new HeartBeats()).add(location);
  }

  private static String getActorInfo(ActorRequestDto actor) {
    return X509Utils.getCertificateInfo(actor.readableName(), actor.certificate().value());
  }
}
