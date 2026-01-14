/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server.management;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.spatz.LifecyclePhases;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.handler.codec.http.DefaultHttpHeaders;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpResponseStatus;
import java.net.InetSocketAddress;
import java.time.Duration;
import java.util.Arrays;
import java.util.function.Predicate;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.autoconfigure.web.server.ManagementServerProperties;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.HttpCodeStatusMapper;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;
import org.springframework.context.SmartLifecycle;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;
import reactor.netty.DisposableChannel;
import reactor.netty.http.server.HttpServer;
import reactor.netty.http.server.HttpServerRequest;
import reactor.netty.http.server.HttpServerResponse;

@Component
public class ManagementServer implements SmartLifecycle {

  private static final Logger logger = LoggerFactory.getLogger(ManagementServer.class);

  private final HttpServer baseServer;
  private final HealthEndpoint healthEndpoint;
  private final HttpCodeStatusMapper httpCodeStatusMapper;
  private final ObjectMapper objectMapper;
  private final InetSocketAddress bindAddress;
  private final String healthPath;
  private final Duration shutdownTimeout;

  private DisposableChannel server;

  public ManagementServer(
      HttpServer baseServer,
      HealthEndpoint healthEndpoint,
      HttpCodeStatusMapper httpCodeStatusMapper,
      ObjectMapper objectMapper,
      ManagementServerProperties managementServerProperties,
      LifecycleProperties lifecycleProperties) {
    this.baseServer = baseServer;
    this.healthEndpoint = healthEndpoint;
    this.httpCodeStatusMapper = httpCodeStatusMapper;
    this.objectMapper = objectMapper;

    bindAddress =
        new InetSocketAddress(
            managementServerProperties.getAddress(), getPort(managementServerProperties));
    healthPath = getBasePath(managementServerProperties) + "actuator/health";
    shutdownTimeout = LifecyclePhases.getShutdownTimeout(lifecycleProperties);
  }

  @Override
  public void start() {
    new Thread(
            () -> {
              logger.info(
                  "Starting {}, binding to {}", this.getClass().getSimpleName(), bindAddress);

              HttpServer bindServer =
                  this.baseServer
                      .doOnBind(c -> logger.info("start listening"))
                      .doOnBound(c -> logger.info("bound"));
              server =
                  bindServer
                      .bindAddress(() -> bindAddress)
                      .handle(this::handlerFunction)
                      .bindNow()
                      .onDispose(
                          () ->
                              logger.info(
                                  "disposing {}, bound to {}",
                                  this.getClass().getSimpleName(),
                                  bindAddress));
              logger.info("started {}, bound to {}", this.getClass().getSimpleName(), bindAddress);
            })
        .start();
  }

  @Override
  public void stop() {
    new Thread(
            () -> {
              logger.info("Stopping {} bound to {}", this.getClass().getSimpleName(), bindAddress);
              server.disposeNow(shutdownTimeout);
              logger.info("Stopped {} bound to {}", this.getClass().getSimpleName(), bindAddress);
            })
        .start();
  }

  @Override
  public boolean isRunning() {
    return server != null && !server.isDisposed();
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.MANAGEMENT_SERVER.phase;
  }

  protected Publisher<Void> handlerFunction(HttpServerRequest in, HttpServerResponse out) {
    String path = in.path();
    HttpMethod method = in.method();
    String scheme = in.scheme();
    String protocol = in.protocol();
    HttpHeaders headers = in.requestHeaders();

    logger.debug(
        "handling management request for path={}, method={}, scheme={}, protocol={}, headers={}",
        path,
        method,
        scheme,
        protocol,
        headers);

    Assert.isTrue(scheme.equals("http"), "");

    if (method != HttpMethod.GET) {
      return out.status(HttpResponseStatus.METHOD_NOT_ALLOWED).send().then();
    }

    if (!path.startsWith(healthPath)) {
      return out.status(HttpResponseStatus.NOT_FOUND).send().then();
    }
    String[] pathSegments =
        Arrays.stream(path.substring(healthPath.length()).split("/"))
            .filter(Predicate.not(String::isEmpty))
            .toArray(String[]::new);

    HealthComponent health = healthEndpoint.healthForPath(pathSegments);
    if (health == null) {
      return out.status(HttpResponseStatus.NOT_FOUND).send().then();
    }

    ByteBuf jsonResponse;
    try {
      jsonResponse = Unpooled.wrappedBuffer(objectMapper.writeValueAsBytes(health));
    } catch (JsonProcessingException e) {
      return handleError(out, e);
    }

    HttpHeaders responseHeaders = new DefaultHttpHeaders();
    responseHeaders.set(HttpHeaderNames.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

    return out.status(httpCodeStatusMapper.getStatusCode(health.getStatus()))
        .headers(responseHeaders)
        .send(Mono.just(jsonResponse))
        .then();
  }

  private static Publisher<Void> handleError(HttpServerResponse out, Exception exception) {
    logger.error("request handling failed", exception);
    return out.status(HttpResponseStatus.INTERNAL_SERVER_ERROR)
        .sendString(Mono.just(exception.getMessage()))
        .then();
  }

  private static int getPort(ManagementServerProperties properties) {
    return properties.getPort() == 0 ? 8080 : properties.getPort();
  }

  private static String getBasePath(ManagementServerProperties properties) {
    String healthPath = properties.getBasePath();
    if (healthPath.startsWith("/")) {
      healthPath = healthPath.substring(1);
    }
    if (!healthPath.isBlank() && !healthPath.endsWith("/")) {
      healthPath += "/";
    }
    return healthPath;
  }
}
