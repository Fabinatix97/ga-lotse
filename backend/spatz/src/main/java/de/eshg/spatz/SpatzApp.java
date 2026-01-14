/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz;

import de.eshg.spatz.config.SpatzConfigurationProperties;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;
import reactor.netty.http.HttpResources;
import reactor.netty.http.server.HttpRequestDecoderSpec;
import reactor.netty.http.server.HttpServer;
import reactor.netty.resources.ConnectionProvider;
import reactor.netty.resources.LoopResources;

@SpringBootApplication
@EnableConfigurationProperties(SpatzConfigurationProperties.class)
public class SpatzApp {

  private static final Logger logger = LoggerFactory.getLogger(SpatzApp.class);
  private static final LoopResources loopResources = LoopResources.create("spatz-net", 1, 4, true);

  @Bean
  HttpServer baseServer(
      @Value("${server.max-http-request-header-size}") DataSize maxHttpRequestHeaderSize,
      SpatzConfigurationProperties spatzConfigurationProperties) {
    HttpServer server = HttpServer.create();

    HttpResources.set(
        ConnectionProvider.builder("http")
            .maxConnections(spatzConfigurationProperties.http().maxConnections())
            .pendingAcquireTimeout(
                Duration.ofMillis(ConnectionProvider.DEFAULT_POOL_ACQUIRE_TIMEOUT))
            // close idle channels:
            .evictInBackground(spatzConfigurationProperties.http().channelEvictionInterval())
            // remove empty channel-pools
            // (see reactor.netty.resources.PooledConnectionProvider.channelPools):
            .disposeInactivePoolsInBackground(
                spatzConfigurationProperties.http().channelPoolDisposeInterval(),
                spatzConfigurationProperties.http().channelPoolInactivity())
            .build());

    int size = (int) maxHttpRequestHeaderSize.toBytes();
    logger.debug("configuring max-http-request-header-size: {}", size);
    HttpRequestDecoderSpec decoder = server.configuration().decoder();
    decoder.maxHeaderSize(size);
    decoder.maxInitialLineLength(size);
    return server;
  }

  public static void main(String[] args) {

    // Disable certificate_authorities server extension to prevent CertificateRequest messages
    // inflation with lots of actors in service-mesh.
    System.setProperty("jdk.tls.client.protocols", "TLSv1.3");
    System.setProperty("jdk.tls.server.protocols", "TLSv1.3");
    System.setProperty("jdk.tls.server.disableExtensions", "certificate_authorities");

    System.setProperty("reactor.schedulers.defaultPoolSize", "1");
    System.setProperty("reactor.schedulers.defaultBoundedElasticSize", "1");

    HttpResources.set(loopResources);

    SpringApplication.run(SpatzApp.class, args);
  }
}
