/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

import static org.apache.logging.log4j.util.Strings.isBlank;

import de.eshg.lib.servicedirectory.api.ActorResponseDto;
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
      "Certificate of the {} '{}' in orgUnit '{}' was invalid: {}";

  private static final String SIGNATORY_INVALID_MSG =
      "Certificate of the {} '{}' in orgUnit '{}' has an untrusted signatory: {}";

  private static final Logger log = LoggerFactory.getLogger(CertificateValidationService.class);

  /**
   * use the truststore of a predefined SSL bundle, that is exclusively used to validate actor
   * certificates or their signatures
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
      if (isValidActor(actor)) {
        result.add(actor);
      } else {
        log.info("Ignoring invalid actor {}", actor.commonName());
      }
    }

    return result;
  }

  private boolean isValidActor(ActorResponseDto actor) {
    return actor.certificate() != null && isSignatoryValidAndSignatureFromSignatory(actor);
  }

  private boolean isSignatoryValidAndSignatureFromSignatory(ActorResponseDto actor) {
    CertificateDto cert = actor.certificate();

    X509Certificate signatory;
    if (!isBlank(cert.signatory()) && !isBlank(cert.signature())) {
      try {
        signatory = X509Utils.parsePem(cert.signatory());
      } catch (Exception e) {
        logInvalidActor(
            "Certificate of the {} '{}' in orgUnit '{}' has no parsable signatory: {}",
            actor,
            cert,
            e);
        return false;
      }

      if (X509Utils.isCaCertificate(signatory)) {
        logInvalidActor(
            "Certificate of the {} '{}' in orgUnit '{}' is signed by a CA certificate: {}",
            actor,
            cert);
        return false;
      }

      if (trustStore != null && neitherInTrustStoreNorSignedByOneInTrustStore(signatory)) {
        logInvalidActor(SIGNATORY_INVALID_MSG, actor, cert);
        return false;
      }
    } else {
      signatory = null;
    }

    boolean allCertsValid;
    try {
      allCertsValid =
          X509Utils.parseMultiPem(cert.value())
              .allMatch(
                  certificate -> {
                    if (X509Utils.isCaCertificate(certificate)) {
                      logInvalidActor(
                          "Certificate of the {} '{}' in orgUnit '{}' is a CA certificate: {}",
                          actor,
                          cert);
                      return false;
                    }

                    if (signatory != null) {
                      try {
                        X509Utils.assertOnlySanIsCn(certificate);
                      } catch (RuntimeException e) {
                        logInvalidActor(
                            "Certificate of the {} '{}' in orgUnit '{}' has invalid SAN: {}: "
                                + e.getMessage(),
                            actor,
                            cert);
                        return false;
                      }

                      return true;
                    }

                    if (trustStore != null
                        && neitherInTrustStoreNorSignedByOneInTrustStore(certificate)) {
                      logInvalidActor(
                          "Certificate of the {} '{}' in orgUnit '{}' is untrusted: {}",
                          actor,
                          cert);
                      return false;
                    }
                    return true;
                  });
    } catch (Exception e) {
      logInvalidActor(
          "Certificates of the {} '{}' in orgUnit '{}' was not parsable: {}", actor, cert, e);
      return false;
    }
    if (!allCertsValid) {
      return false;
    }

    if (signatory != null) {
      if (!isSignatureFromSignatory(cert)) {
        logInvalidActor(INVALID_CERTIFICATE_MSG, actor, cert);
        return false;
      }
    }

    return true;
  }

  private void logInvalidActor(
      String signatoryInvalidMsg, ActorResponseDto actor, CertificateDto cert) {
    log.error(signatoryInvalidMsg, actor.type(), actor.commonName(), actor.orgUnitId(), cert);
  }

  private void logInvalidActor(
      String signatoryInvalidMsg, ActorResponseDto actor, CertificateDto cert, Exception e) {
    log.error(signatoryInvalidMsg, actor.type(), actor.commonName(), actor.orgUnitId(), cert, e);
  }

  private boolean neitherInTrustStoreNorSignedByOneInTrustStore(X509Certificate certificate) {
    return !X509Utils.inTrustStoreOrWasSignedByOneInTrustStore(trustStore, certificate);
  }

  private boolean isSignatureFromSignatory(CertificateDto certificateDTO) {
    return X509Utils.isValidSignature(
        certificateDTO.value(), certificateDTO.signature(), certificateDTO.signatory());
  }
}
