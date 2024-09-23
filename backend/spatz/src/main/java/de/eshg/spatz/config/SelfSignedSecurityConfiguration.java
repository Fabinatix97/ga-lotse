/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.config;

import de.eshg.lsd.register.api.LsdActorApi;
import de.eshg.lsd.register.api.LsdActorApiConfiguration;
import de.eshg.servicedirectory.util.X509Utils;
import de.eshg.spatz.common.SelfSignedCertService;
import de.eshg.spatz.common.SelfSignedCertificatePublisher;
import de.eshg.spatz.common.SslBundleFactory;
import de.eshg.spatz.config.SpatzConfigurationProperties.ActorConfiguration;
import de.eshg.spatz.config.SpatzConfigurationProperties.SslConfiguration;
import java.security.KeyStore;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.ssl.PropertiesSslBundle;
import org.springframework.boot.autoconfigure.ssl.SslAutoConfiguration;
import org.springframework.boot.autoconfigure.ssl.SslBundleProperties.Options;
import org.springframework.boot.autoconfigure.ssl.SslBundleRegistrar;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.ssl.DefaultSslBundleRegistry;
import org.springframework.boot.ssl.NoSuchSslBundleException;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleRegistry;
import org.springframework.boot.ssl.SslOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

@AutoConfiguration(before = SslAutoConfiguration.class, after = LsdActorApiConfiguration.class)
@EnableConfigurationProperties({SpatzConfigurationProperties.class})
public class SelfSignedSecurityConfiguration {

  private static final Logger logger =
      LoggerFactory.getLogger(SelfSignedSecurityConfiguration.class);

  @Bean
  SslBundleFactory sslBundleFactory(SpatzConfigurationProperties spatzConfigurationProperties) {
    SslConfiguration sslConfig = spatzConfigurationProperties.ssl();
    Options options = sslConfig.getOptions();
    SslOptions sslOptions =
        (options != null)
            ? SslOptions.of(options.getCiphers(), options.getEnabledProtocols())
            : SslOptions.NONE;

    SslBundle fixedBundle = PropertiesSslBundle.get(sslConfig);
    KeyStore fixedTrust = fixedBundle.getStores().getTrustStore();
    KeyStore serverKeyStore = fixedBundle.getStores().getKeyStore();
    return new SslBundleFactory(fixedTrust, sslOptions, serverKeyStore, List.of());
  }

  @Bean
  SslBundleRegistrar dynamicSslBundleRegistrar(SslBundleFactory sslBundleFactory) {
    SslBundle sslBundle = sslBundleFactory.build();
    return registry -> {
      logger.info("registering dynamic eshg SSL Bundle");
      registry.registerBundle(X509Utils.ESHGACTOR_BUNDLE_NAME, sslBundle);
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
