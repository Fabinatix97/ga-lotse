/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.dns;

import de.eshg.spatz.config.SpatzConfigurationProperties;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioDatagramChannel;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class UdpServer {

  private static final Logger logger = LoggerFactory.getLogger(UdpServer.class);

  private final DnsQueryHandler handler;
  private final int port;
  private final EventLoopGroup eventLoop;
  private boolean started;

  public UdpServer(DnsQueryHandler handler, SpatzConfigurationProperties spatzConfigProperties) {
    this.handler = handler;
    this.port = spatzConfigProperties.dns().port();
    eventLoop = new NioEventLoopGroup();
  }

  @PostConstruct
  public void run() throws InterruptedException {
    try {
      Bootstrap bootstrap = new Bootstrap();
      bootstrap.group(eventLoop).channel(NioDatagramChannel.class).handler(handler);

      logger.info("Listening on port {}...", port);
      bootstrap.bind("127.0.0.1", port).sync();
    } catch (Exception e) {
      logger.error("Error while Starting DNS server on port {}", port, e);
      destroy();
    }
    started = true;
  }

  @PreDestroy
  public void destroy() throws InterruptedException {
    logger.info("Shutting down...");
    this.eventLoop.shutdownGracefully(0, 5, TimeUnit.SECONDS).sync();
  }

  @Component("dnsHealthIndicator")
  public static class DnsHealthIndicator extends AbstractHealthIndicator {

    private final UdpServer dnsServer;

    public DnsHealthIndicator(UdpServer dnsServer) {
      this.dnsServer = dnsServer;
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) {
      builder.withDetail("udp-port", dnsServer.port);

      if (dnsServer.eventLoop.isShutdown()
          || dnsServer.eventLoop.isTerminated()
          || dnsServer.eventLoop.isShuttingDown()) {
        builder.down();
        return;
      }
      if (dnsServer.started) {
        builder.up();
      } else {
        builder.down();
      }
    }
  }
}
