/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.lib.servicedirectory.api.ActorTypeDto;
import de.eshg.lib.servicedirectory.api.CertificateDto;
import de.eshg.servicedirectory.util.X509Utils;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.cert.Certificate;
import java.security.cert.TrustAnchor;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.stereotype.Service;

@Service
public class CertificateValidationService {

  private static final String INVALID_CERTIFICATE_MSG =
      "The {} certificate of the {} '{}' in orgUnit '{}' was invalid: {}";

  private static final String SIGNATORY_INVALID_MSG =
      "The {} certificate of the {} '{}' in orgUnit '{}' has an untrusted signatory: {}";

  private static final Logger log = LoggerFactory.getLogger(CertificateValidationService.class);

  /**
   * use the truststore of a predefined SSL bundle, that is exclusively used to validate signatures
   * of actor certificates
   */
  public static final String SSL_BUNDLE_NAME = "certificatevalidation";

  private final KeyStore trustStore;

  @Autowired
  public CertificateValidationService(SslBundles sslBundles) {
    this(sslBundles.getBundle(SSL_BUNDLE_NAME).getStores().getTrustStore());
  }

  public CertificateValidationService(KeyStore trustStore) {
    this.trustStore = validateTrustStore(trustStore);
  }

  private KeyStore validateTrustStore(KeyStore trustStore) {
    if (trustStore == null) {
      log.warn(
          "Truststore is not configured or empty: DISABLING trust check for Signatories retrieved from Service Directory");
      return null;
    } else {
      try {
        Set<TrustAnchor> hashSet = getTrustAnchors(trustStore);
        if (hashSet.isEmpty()) {
          log.warn(
              "Truststore is configured but does not contain any X509 Certificate: DISABLING trust check for Signatories retrieved from Service Directory");
          return null;
        } else {
          log.info(
              "Truststore is configured with {} valid X509 Certificates: enabling trust check for Signatories retrieved from Service Directory",
              hashSet.size());
          return trustStore;
        }
      } catch (Exception e) {
        throw new RuntimeException("could not validate truststore: " + e, e);
      }
    }
  }

  private static Set<TrustAnchor> getTrustAnchors(KeyStore trustStore) throws KeyStoreException {
    Set<TrustAnchor> hashSet = new HashSet<>();
    Enumeration<String> aliases = trustStore.aliases();
    while (aliases.hasMoreElements()) {
      String alias = aliases.nextElement();
      if (trustStore.isCertificateEntry(alias)) {
        Certificate cert = trustStore.getCertificate(alias);
        if (cert instanceof X509Certificate x509Certificate) {
          hashSet.add(new TrustAnchor(x509Certificate, null));
        }
      }
    }
    return hashSet;
  }

  public List<ActorResponseDto> keepOnlyValidActors(Collection<ActorResponseDto> allActors) {
    List<ActorResponseDto> result = new ArrayList<>();
    for (ActorResponseDto actor : allActors) {
      if (ActorTypeDto.LSD == actor.type() || isValidActor(actor)) {
        result.add(actor);
      }
    }

    return result;
  }

  private boolean isValidActor(ActorResponseDto actor) {
    return actor.currentCertificate() != null
        && isSignatoryValidAndSignatureFromSignatory(actor, "current")
        && (actor.previousCertificate() == null // may not have a previous yet
            || isSignatoryValidAndSignatureFromSignatory(actor, "previous"));
  }

  private boolean isSignatoryValidAndSignatureFromSignatory(
      ActorResponseDto actor, String curOrPrev) {
    CertificateDto cert =
        "current".equals(curOrPrev) ? actor.currentCertificate() : actor.previousCertificate();

    String signatory = cert.signatory();
    if (trustStore != null && !inTrustStoreOrWasSignedByOneInTrustStore(signatory)) {
      logInvalidActor(SIGNATORY_INVALID_MSG, curOrPrev, actor, cert);
      return false;
    }

    if (!isSignatureFromSignatory(cert)) {
      logInvalidActor(INVALID_CERTIFICATE_MSG, curOrPrev, actor, cert);
      return false;
    }

    return true;
  }

  private void logInvalidActor(
      String signatoryInvalidMsg, String curOrPrev, ActorResponseDto actor, CertificateDto cert) {
    log.error(
        signatoryInvalidMsg, curOrPrev, actor.type(), actor.commonName(), actor.orgUnitId(), cert);
  }

  private boolean inTrustStoreOrWasSignedByOneInTrustStore(String certificateAsPem) {
    return X509Utils.inTrustStoreOrWasSignedByOneInTrustStore(trustStore, certificateAsPem);
  }

  private boolean isSignatureFromSignatory(CertificateDto certificateDTO) {
    return X509Utils.isValidSignature(
        certificateDTO.value(), certificateDTO.signature(), certificateDTO.signatory());
  }
}
