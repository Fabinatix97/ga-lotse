/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import static java.util.stream.Collectors.toCollection;

import de.eshg.lsd.register.api.ActorTypeDto;
import de.eshg.servicedirectory.util.X509Utils;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LsdAttributes {

  private static final Logger logger = LoggerFactory.getLogger(LsdAttributes.class);

  private final Map<String, List<String>> attributes;
  private final String readableName;
  private final HeartBeats heartbeats;

  public LsdAttributes(
      UserRepresentation userRepresentation,
      ActorTypeDto type,
      String readableName,
      String commonName,
      HeartBeats heartbeats) {
    if (userRepresentation.getAttributes() == null) {
      userRepresentation.setAttributes(new HashMap<>());
    }
    attributes = userRepresentation.getAttributes();
    this.readableName = readableName;
    this.heartbeats = heartbeats;
    attributes.putAll(LsdAttributeKey.mapOf(type, readableName, commonName));
  }

  public LsdAttributes(UserRepresentation userRepresentation) {
    if (userRepresentation.getAttributes() == null) {
      userRepresentation.setAttributes(new HashMap<>());
    }
    attributes = userRepresentation.getAttributes();
    readableName = getKey(attributes, LsdAttributeKey.READABLE_NAME);
    heartbeats = null;
  }

  public void update(String certificate, int maxCertificates) {
    List<String> certificates = new ArrayList<>(getCertificates());

    handleLegacyCertificates(certificates);

    certificates.add(normalize(certificate));

    certificates = trimList(certificates, maxCertificates);

    attributes.put(LsdAttributeKey.CERTIFICATE.getKey(), certificates);
  }

  public String getReadableName() {
    return readableName;
  }

  public String getType() {
    return getKey(attributes, LsdAttributeKey.TYPE);
  }

  public List<String> getCertificates() {
    return Optional.ofNullable(attributes.get(LsdAttributeKey.CERTIFICATE.getKey()))
        .orElseGet(List::of);
  }

  public boolean isEmpty() {
    return attributes.isEmpty();
  }

  private void handleLegacyCertificates(List<String> certificates) {
    String legacyCertificate =
        Optional.ofNullable(attributes.remove(LsdAttributeKey.CERTIFICATE_VALUE.getKey()))
            .map(a -> a.isEmpty() ? null : a.getFirst())
            .orElse(null);
    attributes.remove(LsdAttributeKey.CERTIFICATE_SIGNATURE.getKey());
    if (legacyCertificate != null) {
      certificates.add(normalize(legacyCertificate));
    }
  }

  private List<String> trimList(List<String> certPems, int size) {
    logger.debug("trim {} to {}", certPems.size(), size);
    ArrayList<X509Certificate> certificates =
        certPems.stream().map(X509Utils::parsePem).collect(toCollection(ArrayList::new));
    removeExpired(certificates);
    while (true) {
      removeDead(certificates);
      if (certificates.size() <= size) break;
      logger.info("Forgetting heartbeat for {}:{}", readableName, heartbeats.removeEldestEntry());
    }
    logger.debug(
        "Trimmed {} to {} (max {}) for {}",
        certPems.size(),
        certificates.size(),
        size,
        readableName);
    return certificates.stream().map(X509Utils::toPem).map(LsdAttributes::normalize).toList();
  }

  private void removeExpired(ArrayList<X509Certificate> certificates) {
    Date now = new Date();
    certificates.removeIf(
        cert -> {
          boolean isExpired = cert.getNotAfter().before(now);
          if (isExpired) {
            logger.info(
                "Removing expired certificate for {}:{}",
                readableName,
                X509Utils.extractLocation(cert));
          }
          return isExpired;
        });
  }

  private void removeDead(List<X509Certificate> certificates) {
    certificates.removeIf(
        cert -> {
          String location = X509Utils.extractLocation(cert);
          boolean isDead = !heartbeats.contains(location);
          if (isDead) {
            logger.info("Removing dead certificate for {}:{}", readableName, location);
          }
          return isDead;
        });
  }

  private static String normalize(String s) {
    return s.replaceAll("\r\n", "\n").trim() + "\n";
  }

  private static String getKey(Map<String, List<String>> attributes, LsdAttributeKey key) {
    List<String> strings = attributes.get(key.getKey());
    if (strings == null || strings.isEmpty() || strings.getFirst() == null) {
      return null;
    }
    return strings.getFirst();
  }
}
