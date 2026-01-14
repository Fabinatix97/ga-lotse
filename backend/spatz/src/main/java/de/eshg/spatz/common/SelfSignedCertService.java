/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import static de.eshg.servicedirectory.util.X509Utils.ESHGACTOR_BUNDLE_NAME;

import de.eshg.spatz.LifecyclePhases;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import de.eshg.spatz.config.SpatzConfigurationProperties.ActorConfiguration;
import de.eshg.spatz.config.SpatzConfigurationProperties.SelfSignedConfiguration;
import de.eshg.spatz.security.CertificateBuild;
import de.eshg.spatz.security.CertificateBuilder;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health.Builder;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleRegistry;
import org.springframework.context.SmartLifecycle;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
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
public class SelfSignedCertService implements SmartLifecycle {

  private static final Logger logger = LoggerFactory.getLogger(SelfSignedCertService.class);

  private static final Fraction useNew = new Fraction(1, 6);
  private static final Fraction createNew = new Fraction(2, 3);

  private final SelfSignedConfiguration config;
  private final ActorConfiguration actorConfiguration;
  private final TaskScheduler taskScheduler;
  private final AtomicBoolean isRunning = new AtomicBoolean(false);
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
  }

  @Override
  public void start() {
    isRunning.set(true);
    taskScheduler.schedule(this::renew, Instant.now());
  }

  @Override
  public void stop() {
    isRunning.set(false);
  }

  @Override
  public boolean isRunning() {
    return isRunning.get();
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.SELF_SIGNED_CERT_SERVICE.phase;
  }

  private void renew() {
    if (!isRunning.get()) {
      return;
    }
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
            .withLocation(config.getSubjectLocation())
            .maxAge(config.getMaxAge())
            .keyParameters(config.getKeyParameters())
            .certificateAuthority(false)
            .build();

    logger.info(
        "created self-signed {} certificate for {} (location {}); valid from {} to {}",
        config.getKeyParameters(),
        actorConfiguration.hostname(),
        config.getSubjectLocation(),
        certificateBuild.certificate().getNotBefore(),
        certificateBuild.certificate().getNotAfter());
    logger.debug("Certificate PEM: {}", certificateBuild.pemCrt());
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

  @Scheduled(fixedDelayString = "${eshg.spatz.self-signed.heartbeat:9000}")
  public void heartbeat() {
    if (certificate != null && isRunning.get()) {
      logger.debug("Sending heartbeat to LSD");
      selfSignedCertificatePublisher.heartBeat(config.getSubjectLocation());
    }
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

  @Component("certificateDistributedHealthIndicator")
  public static class CertificatePublishedHealthIndicator extends AbstractHealthIndicator {
    private final SelfSignedConfiguration config;
    private final Optional<ServiceDirectoryTopologyService> serviceDirectoryTopologyService;

    public CertificatePublishedHealthIndicator(
        SpatzConfigurationProperties config,
        Optional<ServiceDirectoryTopologyService> serviceDirectoryTopologyService) {
      this.config = config.selfSigned();
      this.serviceDirectoryTopologyService = serviceDirectoryTopologyService;
    }

    @Override
    protected void doHealthCheck(Builder builder) {
      builder.withDetail("certificate-type", config.isEnabled() ? "self-signed" : "ca-signed");

      if (!config.isEnabled()) {
        builder.up();
        return;
      } else if (serviceDirectoryTopologyService.isEmpty()) {
        logger.warn(
            "eshg-spatz.self-signed.enabled is true but no eshg.servicedirectory.baseUrl configured. health check may be inaccurate.");
        builder.up();
        return;
      }

      Instant certificateDistributedTime =
          serviceDirectoryTopologyService.get().getCertificateDistributedTime();
      if (certificateDistributedTime != null
          && certificateDistributedTime.isBefore(Instant.now())) {
        builder.up();
      } else {
        builder.down();
      }
    }
  }
}
