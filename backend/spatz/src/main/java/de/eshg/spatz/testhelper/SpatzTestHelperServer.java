/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.testhelper;

import de.eshg.spatz.LifecyclePhases;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpResponseStatus;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.time.Duration;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import reactor.netty.DisposableChannel;
import reactor.netty.http.server.HttpServer;
import reactor.netty.http.server.HttpServerRequest;
import reactor.netty.http.server.HttpServerResponse;

@Component
@ConditionalOnTestHelperEnabled
@ConditionalOnProperty(name = "eshg.spatz.self-signed.enabled", havingValue = "true")
public class SpatzTestHelperServer implements SmartLifecycle {

  private static final Logger logger = LoggerFactory.getLogger(SpatzTestHelperServer.class);

  public static final int SPATZ_TEST_HELPER_PORT = 12354;

  private final HttpServer baseServer;
  private final InetSocketAddress bindAddress;
  private final String resetPath;
  private final Duration shutdownTimeout;

  private final SpatzTestHelperController spatzTestHelperController;

  private DisposableChannel server;

  public SpatzTestHelperServer(
      HttpServer baseServer,
      LifecycleProperties lifecycleProperties,
      SpatzTestHelperController spatzTestHelperController) {
    this.baseServer = baseServer;
    this.spatzTestHelperController = spatzTestHelperController;

    bindAddress = new InetSocketAddress((InetAddress) null, SPATZ_TEST_HELPER_PORT);
    resetPath = SpatzTestHelperApi.BASE_URL + "/reset";
    shutdownTimeout = LifecyclePhases.getShutdownTimeout(lifecycleProperties);
  }

  @Override
  public void start() {
    new Thread(
            () -> {
              logger.info("Starting {}, binding to {}", getClass().getSimpleName(), bindAddress);

              HttpServer bindServer =
                  baseServer
                      .doOnBind(_ -> logger.info("start listening"))
                      .doOnBound(_ -> logger.info("bound"));
              server =
                  bindServer
                      .bindAddress(() -> bindAddress)
                      .handle(this::handlerFunction)
                      .bindNow()
                      .onDispose(
                          () ->
                              logger.info(
                                  "disposing {}, bound to {}",
                                  getClass().getSimpleName(),
                                  bindAddress));
              logger.info("started {}, bound to {}", getClass().getSimpleName(), bindAddress);
            })
        .start();
  }

  @Override
  public void stop() {
    new Thread(
            () -> {
              logger.info("Stopping {} bound to {}", getClass().getSimpleName(), bindAddress);
              server.disposeNow(shutdownTimeout);
              logger.info("Stopped {} bound to {}", getClass().getSimpleName(), bindAddress);
            })
        .start();
  }

  @Override
  public boolean isRunning() {
    return server != null && !server.isDisposed();
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.SPATZ_TEST_HELPER_SERVER.phase;
  }

  private Publisher<Void> handlerFunction(HttpServerRequest in, HttpServerResponse out) {
    logger.info(
        "handling Spatz test helper request for path={}, method={}", in.path(), in.method());
    Assert.isTrue(in.scheme().equals("http"), "");

    if (in.method() == HttpMethod.POST && resetPath.substring(1).equals(in.path())) {
      spatzTestHelperController.reset();
      return out.status(HttpResponseStatus.OK).send().then();
    }

    return out.status(HttpResponseStatus.NOT_FOUND).send().then();
  }
}
