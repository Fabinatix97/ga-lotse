/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.dns;

import de.eshg.spatz.LifecyclePhases;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioDatagramChannel;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class UdpServer implements SmartLifecycle {

  private static final Logger logger = LoggerFactory.getLogger(UdpServer.class);

  private final DnsQueryHandler handler;
  private final int port;
  private final EventLoopGroup eventLoop;
  private final Duration shutdownTimeout;
  private final AtomicBoolean isRunning = new AtomicBoolean(false);

  public UdpServer(
      DnsQueryHandler handler,
      SpatzConfigurationProperties spatzConfigProperties,
      LifecycleProperties lifecycleProperties) {
    this.handler = handler;
    this.port = spatzConfigProperties.dns().port();
    eventLoop = new NioEventLoopGroup();
    shutdownTimeout = LifecyclePhases.getShutdownTimeout(lifecycleProperties);
  }

  @Override
  public void start() {
    try {
      Bootstrap bootstrap = new Bootstrap();
      bootstrap.group(eventLoop).channel(NioDatagramChannel.class).handler(handler);

      logger.info("Listening on port {}...", port);
      bootstrap.bind("127.0.0.1", port).sync();
    } catch (Exception e) {
      logger.error("Error while Starting DNS server on port {}", port, e);
      stop();
    }
    isRunning.set(true);
  }

  @Override
  public void stop() {
    logger.info("Shutting down...");
    try {
      this.eventLoop
          .shutdownGracefully(0, shutdownTimeout.toMillis(), TimeUnit.MILLISECONDS)
          .sync();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
    isRunning.set(false);
  }

  @Override
  public boolean isRunning() {
    return isRunning.get();
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.UDP_SERVER.phase;
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
      if (dnsServer.isRunning.get()) {
        builder.up();
      } else {
        builder.down();
      }
    }
  }
}
