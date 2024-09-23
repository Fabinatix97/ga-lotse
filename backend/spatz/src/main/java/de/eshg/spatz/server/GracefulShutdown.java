/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.server.GracefulShutdownCallback;
import org.springframework.boot.web.server.GracefulShutdownResult;

/**
 * Handles Netty graceful shutdown.
 *
 * <p>Based on code from
 *
 * @see org.springframework.boot.web.embedded.netty.GracefulShutdown
 */
public final class GracefulShutdown {

  private static final Logger log = LoggerFactory.getLogger(GracefulShutdown.class);

  private final Supplier<ProxyServer> disposableServer;

  private volatile Thread shutdownThread;

  GracefulShutdown(Supplier<ProxyServer> disposableServer) {
    this.disposableServer = disposableServer;
  }

  void shutDownGracefully(GracefulShutdownCallback callback) {
    ProxyServer server = this.disposableServer.get();
    if (server == null) {
      return;
    }
    log.info(
        "Commencing graceful shutdown for port {}. Waiting for active requests to complete",
        server.getListeningPort());
    this.shutdownThread =
        new Thread(
            () -> doShutdown(callback, server), "netty-shutdown_" + server.getListeningPort());
    this.shutdownThread.start();
  }

  private void doShutdown(GracefulShutdownCallback callback, ProxyServer server) {
    try {
      server.stop();
      log.info("Graceful shutdown complete for port {}", server.getListeningPort());
      callback.shutdownComplete(GracefulShutdownResult.IDLE);
    } catch (Exception ex) {
      log.info(
          "Graceful shutdown aborted with one or more requests still active on port {}",
          server.getListeningPort());
      callback.shutdownComplete(GracefulShutdownResult.REQUESTS_ACTIVE);
    } finally {
      this.shutdownThread = null;
    }
  }
}
