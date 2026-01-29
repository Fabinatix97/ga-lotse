/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.config;

import de.eshg.lsd.register.api.LsdActorApi;
import de.eshg.lsd.register.api.LsdActorApiConfiguration;
import de.eshg.spatz.common.SelfSignedCertService;
import de.eshg.spatz.common.SelfSignedCertificatePublisher;
import de.eshg.spatz.common.SslBundleFactory;
import de.eshg.spatz.config.SpatzConfigurationProperties.ActorConfiguration;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.ssl.SslAutoConfiguration;
import org.springframework.boot.autoconfigure.ssl.SslBundleRegistrar;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.ssl.DefaultSslBundleRegistry;
import org.springframework.boot.ssl.NoSuchSslBundleException;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

@AutoConfiguration(before = SslAutoConfiguration.class, after = LsdActorApiConfiguration.class)
@EnableConfigurationProperties({SpatzConfigurationProperties.class})
@EnableScheduling
public class SelfSignedSecurityConfiguration {

  private static final Logger logger =
      LoggerFactory.getLogger(SelfSignedSecurityConfiguration.class);

  public static final String ESHGACTOR_BUNDLE_NAME = "eshgactor";
  public static final String ESHGACTOR_CLIENT_BUNDLE_NAME = "eshgactorclient";

  @Bean
  SslBundleFactory sslBundleFactory(SpatzConfigurationProperties properties) {
    if (hasSelfSignedCertificate(properties) || hasDualUseCertificate(properties)) {
      logger.info("Creating SSL bundle factory with dual-use certificate");
      return SslBundleFactory.forDualUseCertificate(properties.ssl());
    } else {
      logger.info("Creating SSL bundle factory with single-use certificates");
      return SslBundleFactory.forSingleUseCertificates(
          properties.serverSsl(), properties.clientSsl());
    }
  }

  private boolean hasSelfSignedCertificate(SpatzConfigurationProperties properties) {
    return properties.selfSigned().isEnabled();
  }

  private boolean hasDualUseCertificate(SpatzConfigurationProperties properties) {
    return properties.ssl().getKeystore().getCertificate() != null;
  }

  @Bean
  SslBundleRegistrar dynamicSslBundleRegistrar(SslBundleFactory sslBundleFactory) {
    SslBundle sslBundle = sslBundleFactory.build();
    SslBundle clientBundle = sslBundleFactory.buildClientBundle();
    return registry -> {
      logger.info("registering dynamic eshg SSL Bundle");
      registry.registerBundle(ESHGACTOR_BUNDLE_NAME, sslBundle);
      if (clientBundle == null) {
        logger.info("No separate eshg SSL Client Bundle!");
      } else {
        logger.info("registering dynamic eshg SSL Client Bundle");
        registry.registerBundle(ESHGACTOR_CLIENT_BUNDLE_NAME, clientBundle);
      }
    };
  }

  @Bean
  @ConditionalOnProperty(name = "eshg.spatz.self-signed.enabled", havingValue = "true")
  SelfSignedCertificatePublisher certificatePublisher(
      LsdActorApi lsdApi,
      SpatzConfigurationProperties configurationProperties,
      SelfSignedCertificateLatch latch) {
    ActorConfiguration actorConfiguration = configurationProperties.actor();
    return new SelfSignedCertificatePublisher(
        lsdApi, latch, actorConfiguration.readableName(), actorConfiguration.type());
  }

  @Bean
  public DefaultSslBundleRegistry lockingSslBundleRegistry(
      ObjectProvider<SslBundleRegistrar> sslBundleRegistrars) {
    Lock lock = new ReentrantLock();
    DefaultSslBundleRegistry sslBundleRegistry =
        new DefaultSslBundleRegistry() {
          @Override
          public void updateBundle(String name, SslBundle updatedBundle)
              throws NoSuchSslBundleException {
            lock.lock();
            try {
              super.updateBundle(name, updatedBundle);
            } finally {
              lock.unlock();
            }
          }
        };
    for (SslBundleRegistrar registrar : sslBundleRegistrars) {
      registrar.registerBundles(sslBundleRegistry);
    }
    return sslBundleRegistry;
  }

  @Bean
  @ConditionalOnMissingBean(TaskScheduler.class)
  public TaskScheduler taskScheduler() {
    return new ConcurrentTaskScheduler(Executors.newSingleThreadScheduledExecutor());
  }

  @Bean
  public SelfSignedCertificateLatch selfSignedCertificateLatch(
      SpatzConfigurationProperties config) {
    return new SelfSignedCertificateLatch(
        config.selfSigned() != null && config.selfSigned().isEnabled());
  }

  @Bean
  @ConditionalOnProperty(name = "eshg.spatz.self-signed.enabled", havingValue = "true")
  public SelfSignedCertService selfSignedCertService(
      SpatzConfigurationProperties config,
      TaskScheduler taskScheduler,
      SslBundleFactory sslBundleFactory,
      SslBundleRegistry sslBundleRegistry,
      SelfSignedCertificatePublisher selfSignedCertificatePublisher) {
    return new SelfSignedCertService(
        config.selfSigned(),
        config.actor(),
        taskScheduler,
        sslBundleFactory,
        sslBundleRegistry,
        selfSignedCertificatePublisher);
  }
}
