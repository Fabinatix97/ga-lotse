/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz;

import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import de.eshg.spatz.relay.SpatzRelayConnection;
import de.eshg.spatz.server.ProxyServer;
import de.eshg.spatz.server.inbound.InboundServer;
import de.eshg.spatz.server.outbound.OutboundServer;
import de.eshg.spatz.server.outbound.OutboundServer.RelayAddressMapper;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.util.unit.DataSize;
import reactor.netty.http.HttpResources;
import reactor.netty.http.server.HttpRequestDecoderSpec;
import reactor.netty.http.server.HttpServer;
import reactor.netty.resources.ConnectionProvider;

@SpringBootApplication
@EnableConfigurationProperties(SpatzConfigurationProperties.class)
@Import(SpatzRelayConnection.class)
public class SpatzApp {

  private static final Logger logger = LoggerFactory.getLogger(SpatzApp.class);

  private final ConfigurableApplicationContext context;

  public SpatzApp(ConfigurableApplicationContext context) {
    this.context = context;
  }

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

  @Bean
  InboundServer inboundServer(
      HttpServer baseServer,
      SpatzConfigurationProperties spatzConfigProperties,
      SslBundles sslBundles,
      ServiceDirectoryApi serviceDirectoryApi) {
    InboundServer inboundServer =
        new InboundServer(
            baseServer, spatzConfigProperties.inbound(), sslBundles, serviceDirectoryApi);
    logger.info(
        "SPATZ created inbound server on port {}, forwarding to port {}",
        inboundServer.getListeningPort(),
        inboundServer.getInboundTargetPort());

    startServerAwaitThread(inboundServer);
    return inboundServer;
  }

  @Bean
  OutboundServer outboundServer(
      HttpServer baseServer,
      SpatzConfigurationProperties spatzConfigProperties,
      SslBundles sslBundles,
      RelayAddressMapper addressMapper) {
    OutboundServer outboundServer =
        new OutboundServer(
            baseServer,
            spatzConfigProperties.outbound(),
            sslBundles,
            spatzConfigProperties.dns().upstreamHost(),
            addressMapper);
    logger.info("SPATZ created outbound server on port {}", outboundServer.getListeningPort());

    startServerAwaitThread(outboundServer);
    return outboundServer;
  }

  private void startServerAwaitThread(ProxyServer server) {
    Thread awaitThread =
        new Thread("start_server_" + server.getListeningPort()) {
          @Override
          public void run() {
            try {
              server.start();
            } catch (Throwable throwable) {
              logger.error("Thread terminated unexpectedly", throwable);
              SpringApplication.exit(context, () -> 1);
              throw throwable;
            }
          }
        };
    awaitThread.setContextClassLoader(getClass().getClassLoader());
    awaitThread.setDaemon(false);
    awaitThread.start();
  }

  public static void main(String[] args) {
    SpringApplication.run(SpatzApp.class, args);
  }
}
