/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.lib.servicedirectory.api.ActorRequestDto;
import de.eshg.lib.servicedirectory.api.PostTopologyRequestDto;
import de.eshg.lsd.exception.InvalidCertificateException;
import de.eshg.lsd.keycloak.LsdKeycloakClient;
import de.eshg.lsd.register.api.ActorDto;
import de.eshg.lsd.register.api.ActorTypeDto;
import de.eshg.lsd.register.api.CertificateDto;
import de.eshg.servicedirectory.util.X509Utils;
import java.util.*;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ActorService {
  private static final Logger log = LoggerFactory.getLogger(ActorService.class);

  private final LsdKeycloakClient keycloakClient;

  private final SignatureService signatureService;

  private final ServiceDirectoryApi serviceDirectoryApi;

  public ActorService(
      LsdKeycloakClient keycloakClient,
      SignatureService signatureService,
      ServiceDirectoryApi serviceDirectoryApi) {
    this.keycloakClient = keycloakClient;
    this.signatureService = signatureService;
    this.serviceDirectoryApi = serviceDirectoryApi;
  }

  public List<ActorDto> getActors() {
    return keycloakClient.getRealm().users().list().stream()
        .map(this::getActorDtoOrNull)
        .filter(Objects::nonNull)
        .toList();
  }

  private ActorDto getActorDtoOrNull(UserRepresentation user) {
    Map<String, List<String>> attr = user.getAttributes();

    if (attr == null) {
      log.warn("user {} has no attributes (null)", user.getUsername());
      return null;
    }

    List<LsdAttributeKey> missing = new ArrayList<>();

    String certificate = getKey(attr, LsdAttributeKey.CERTIFICATE_VALUE, missing);
    String signature = getKey(attr, LsdAttributeKey.CERTIFICATE_SIGNATURE, missing);
    String type = getKey(attr, LsdAttributeKey.TYPE, missing);
    String readableName = getKey(attr, LsdAttributeKey.READABLE_NAME, missing);

    if (certificate == null || signature == null || type == null || readableName == null) {
      log.warn("user {} has missing attributes: {}", user.getUsername(), missing);
      return null;
    }

    String signatory = signatureService.getCertificate();
    return new ActorDto(
        user.getUsername(),
        new CertificateDto(certificate, signature, signatory),
        ActorTypeDto.valueOf(type),
        readableName);
  }

  private static String getKey(
      Map<String, List<String>> attributes, LsdAttributeKey key, List<LsdAttributeKey> missing) {
    List<String> strings = attributes.get(key.getKey());
    if (strings == null || strings.isEmpty() || strings.getFirst() == null) {
      missing.add(key);
      return null;
    }
    return strings.getFirst();
  }

  public void updateTopology() {
    List<ActorDto> actorDtos = getActors();
    List<ActorRequestDto> actorRequestDtos = new ArrayList<>();

    for (ActorDto actorDto : actorDtos) {
      if (actorDto.certificate() != null) {
        actorRequestDtos.add(
            new ActorRequestDto(
                actorDto.readableName(),
                ActorTypeDto.convert(
                    actorDto.type(), de.eshg.lib.servicedirectory.api.ActorTypeDto.class),
                actorDto.commonName(),
                new de.eshg.lib.servicedirectory.api.CertificateDto(
                    actorDto.certificate().value(),
                    actorDto.certificate().signature(),
                    actorDto.certificate().signatory())));
      }
    }

    var request = new PostTopologyRequestDto(actorRequestDtos);
    if (!request.actorsRequest().isEmpty()) {
      serviceDirectoryApi.postTopology(request);
    }
  }

  public ActorDto updateActor(
      ActorTypeDto type, String certificate, String userName, String readableName) {
    String commonName = X509Utils.extractCommonName(X509Utils.parsePem(certificate));
    UserResource userResource = getValidUserOrThrow(commonName, userName);
    UserRepresentation userRepresentation = userResource.toRepresentation();

    Map<String, List<String>> attributes = userRepresentation.getAttributes();
    if (userRepresentation.getAttributes() == null) {
      attributes = new HashMap<>();
      userRepresentation.setAttributes(attributes);
    }

    String signature = signatureService.sign(certificate);
    attributes.putAll(
        LsdAttributeKey.mapOf(certificate, signature, type, readableName, commonName));

    userResource.update(userRepresentation);

    return new ActorDto(
        commonName,
        new CertificateDto(certificate, signature, signatureService.getCertificate()),
        type,
        readableName);
  }

  private UserResource getValidUserOrThrow(String commonName, String userName) {
    UserResource user = keycloakClient.getUserByNameOrThrow(commonName);
    if (!commonName.equals(userName)) {
      throw new InvalidCertificateException(commonName, userName);
    }
    return user;
  }
}
