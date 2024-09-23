/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import static de.eshg.servicedirectory.util.X509Utils.ESHGACTOR_BUNDLE_NAME;

import de.eshg.spatz.config.SpatzConfigurationProperties.ActorConfiguration;
import de.eshg.spatz.config.SpatzConfigurationProperties.SelfSignedConfiguration;
import de.eshg.spatz.security.CertificateBuild;
import de.eshg.spatz.security.CertificateBuilder;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.util.Assert;

/**
 * The lifecycle of a certificate:
 *
 * <ul>
 *   <li>it's created ({@link java.security.cert.X509Certificate#getNotBefore})
 *   <li>it's used for new connections<a href="#footnote1">¹</a> ({@link
 *       SelfSignedCertService#useNew}(⅙) of cert life<a href="#footnote2">²</a>)
 *   <li>it's supplemented with another certificate ({@link SelfSignedCertService#createNew}(⅔) of
 *       cert life<a href="#footnote2">²</a>)
 *   <li>it's no longer used for new connections ((1 - {@link SelfSignedCertService#useNew})(⅚) of
 *       cert life<a href="#footnote2">²</a>)
 *   <li>it expires ({@link java.security.cert.X509Certificate#getNotAfter})
 *   <li>it's deleted ((1 + {@link SelfSignedCertService#createNew})(1⅔) of cert life<a
 *       href="#footnote2">²</a>)
 * </ul>
 *
 * <p id="footnote1">1) On application start, when there's no existing certificate the first newly
 * created certificate is used immediately on creation time for new connections.
 *
 * <p id="footnote2">2) Cert life is the time from {@link
 * java.security.cert.X509Certificate#getNotBefore} to {@link
 * java.security.cert.X509Certificate#getNotAfter()}.
 */
public class SelfSignedCertService {

  private static final Logger logger = LoggerFactory.getLogger(SelfSignedCertService.class);

  private static final Fraction useNew = new Fraction(1, 6);
  private static final Fraction createNew = new Fraction(2, 3);

  private final SelfSignedConfiguration config;
  private final ActorConfiguration actorConfiguration;
  private final TaskScheduler taskScheduler;
  private final SslBundleFactory sslBundleFactory;
  private final SslBundleRegistry sslBundleRegistry;
  private final SelfSignedCertificatePublisher selfSignedCertificatePublisher;
  private CertificateBuild certificate;

  public SelfSignedCertService(
      SelfSignedConfiguration config,
      ActorConfiguration actorConfiguration,
      TaskScheduler taskScheduler,
      SslBundleFactory sslBundleFactory,
      SslBundleRegistry sslBundleRegistry,
      SelfSignedCertificatePublisher selfSignedCertificatePublisher) {
    this.config = config;
    this.actorConfiguration = actorConfiguration;
    this.taskScheduler = taskScheduler;
    this.sslBundleFactory = sslBundleFactory;
    this.sslBundleRegistry = sslBundleRegistry;
    this.selfSignedCertificatePublisher = selfSignedCertificatePublisher;
    taskScheduler.schedule(this::renew, Instant.now());
  }

  private void renew() {
    CertificateBuild previousCertificate = certificate;
    certificate = createCertificate();

    selfSignedCertificatePublisher.publishServerCertificates(certificate.pemCrt());

    if (previousCertificate == null) {
      logger.debug("Using certificate immediately");
      useCurrentCertificate();
    } else {
      schedule("usage", this::useCurrentCertificate, useNew);
    }

    schedule("creation", this::renew, createNew);
  }

  private void schedule(String name, Runnable callable, Fraction certLifeFraction) {
    Instant time = certLifeFraction.cert(certificate);
    logger.info("Scheduling certificate {} for {}", name, time);
    taskScheduler.schedule(callable, time);
  }

  private CertificateBuild createCertificate() {
    CertificateBuild certificateBuild =
        CertificateBuilder.forHost(actorConfiguration.hostname())
            .withAltName(
                Optional.ofNullable(config.getSubjectAlternativeNames())
                    .orElse(Collections.emptyList()))
            .maxAge(config.getMaxAge())
            .keyParameters(config.getKeyParameters())
            .certificateAuthority(true)
            .build();

    logger.info(
        "created self-signed {} certificate for {} (and {}); valid from {} to {}",
        config.getKeyParameters(),
        actorConfiguration.hostname(),
        config.getSubjectAlternativeNames(),
        certificateBuild.certificate().getNotBefore(),
        certificateBuild.certificate().getNotAfter());
    return certificateBuild;
  }

  private void useCurrentCertificate() {
    SslBundle newSslBundle =
        sslBundleFactory.buildWithNewServerCertificate(
            certificate.keyPair(), certificate.certificate());

    sslBundleRegistry.updateBundle(ESHGACTOR_BUNDLE_NAME, newSslBundle);
    logger.info("updated SSL Truststore with new key");
    logger.debug("server certificate used: {}", certificate.certificate());
  }

  private static Instant getNotBefore(CertificateBuild certificate) {
    return certificate.certificate().getNotBefore().toInstant();
  }

  private static Instant getNotAfter(CertificateBuild certificate) {
    return certificate.certificate().getNotAfter().toInstant();
  }

  private record Fraction(int numerator, int denominator) {
    private Fraction {
      Assert.isTrue(denominator != 0, "Divide by zero");
    }

    private Instant from(Instant start, Instant end) {
      Duration maxAge = Duration.between(start, end);
      return start.plus(maxAge.multipliedBy(numerator).dividedBy(denominator));
    }

    private Instant cert(CertificateBuild certificate) {
      return from(getNotBefore(certificate), getNotAfter(certificate));
    }
  }
}
