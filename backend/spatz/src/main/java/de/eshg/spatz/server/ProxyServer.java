/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

import static de.eshg.servicedirectory.util.X509Utils.ESHGACTOR_BUNDLE_NAME;

import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.ssl.SslContext;
import jakarta.annotation.PreDestroy;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import javax.net.ssl.SSLException;
import nl.altindag.ssl.SSLFactory;
import nl.altindag.ssl.netty.util.NettySslUtils;
import nl.altindag.ssl.util.SSLFactoryUtils;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.boot.web.server.GracefulShutdownResult;
import reactor.netty.DisposableChannel;
import reactor.netty.http.server.HttpServer;
import reactor.netty.http.server.HttpServerRequest;
import reactor.netty.http.server.HttpServerResponse;

public abstract class ProxyServer implements SpatzHttpServer, HealthIndicator {

  protected static final Logger logger = LoggerFactory.getLogger(ProxyServer.class);
  public static final String ALLOWED_PROTOCOL = "TLSv1.3";
  public static final String[] ALLOWED_CIPHERS = {
    "TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256"
  };

  /** Netty HttpServer */
  protected final HttpServer baseServer;

  private final String listeningHost;

  /** Port, which the server will listen to. */
  protected final Integer listeningPort;

  /** Disposable for closing the server port connection. */
  private DisposableChannel server;

  private final boolean clientAuth;
  private final List<String> clientCnAllowList;
  private final SslBundles sslBundles;
  private final SSLFactory dynamicSSLFactory;

  private final SslContext serverContext;
  private final SslContext clientContext;

  private final AtomicReference<Status> status = new AtomicReference<>(Status.CREATED);

  protected ProxyServer(
      HttpServer baseServer,
      String listeningHost,
      Integer listeningPort,
      boolean clientAuth,
      List<String> clientCnAllowList,
      SslBundles sslBundles) {
    this.baseServer = baseServer;
    this.listeningHost = Objects.requireNonNull(listeningHost);
    this.listeningPort = Objects.requireNonNull(listeningPort);
    this.clientAuth = clientAuth;
    this.clientCnAllowList = clientCnAllowList;
    this.sslBundles = sslBundles;
    dynamicSSLFactory =
        SSLFactory.builder()
            .withNeedClientAuthentication(clientAuth)
            .withDummyIdentityMaterial()
            .withSystemTrustMaterial()
            .withSwappableIdentityMaterial()
            .withSwappableTrustMaterial()
            .build();

    try {
      serverContext = NettySslUtils.forServer(dynamicSSLFactory).build();
      clientContext = NettySslUtils.forClient(dynamicSSLFactory).build();
    } catch (SSLException e) {
      throw new SslContextException("failed to build SSL context", e);
    }
  }

  public SslContext getClientContext() {
    return clientContext;
  }

  public boolean isClientAuth() {
    return clientAuth;
  }

  public List<String> getClientCnAllowList() {
    return clientCnAllowList;
  }

  void onSslBundleUpdate(SslBundle sslBundle) {
    logger.info("ssl configuration changed, applying for mTLS connections");

    logger.trace("original protocols: {}", dynamicSSLFactory.getProtocols());
    logger.trace("original ciphers: {}", dynamicSSLFactory.getCiphers());

    SSLFactory updated =
        SSLFactory.builder()
            .withNeedClientAuthentication(clientAuth)
            .withTrustMaterial(sslBundle.getManagers().getTrustManagerFactory())
            .withSystemTrustMaterial()
            .withIdentityMaterial(sslBundle.getManagers().getKeyManagerFactory())
            .withProtocols(ALLOWED_PROTOCOL)
            .withCiphers(ALLOWED_CIPHERS)
            .build();

    logger.debug("updated protocols: {}", updated.getProtocols());
    logger.debug("updated ciphers: {}", updated.getCiphers());

    SSLFactoryUtils.reload(dynamicSSLFactory, updated);
  }

  /**
   * A handler function which contains the real proxy-logic. Depending on the situation, we have
   * different handlerFunctions for traffic from inside the pod (outbound to the world) and for
   * traffic from another SPATZ (inbound from the world).
   *
   * @param in for incoming traffic of the underlying channel
   * @param out for outgoing traffic of the underlying channel
   * @return a Publisher just like any other handler function in the Netty world
   */
  protected abstract Publisher<Void> handlerFunction(HttpServerRequest in, HttpServerResponse out);

  @Override
  public Integer getListeningPort() {
    return listeningPort;
  }

  @Override
  public void start() {
    logger.info("Starting server, binding to {}:{}", listeningHost, listeningPort);

    onSslBundleUpdate(sslBundles.getBundle(ESHGACTOR_BUNDLE_NAME));
    sslBundles.addBundleUpdateHandler(ESHGACTOR_BUNDLE_NAME, this::onSslBundleUpdate);

    HttpServer bindServer =
        this.baseServer
            // Listen to events
            .doOnBind(c -> logger.info("start listening"))
            .doOnBound(
                c -> {
                  logger.info("bound");
                  status.set(Status.STARTED);
                });
    server =
        setupSsl(bindServer.host(listeningHost).port(listeningPort), serverContext)
            .handle(this::handlerFunction)
            .bindNow()
            .onDispose(() -> logger.info("stopped server"));
    logger.info("started server");

    server.onDispose().block();
  }

  protected boolean isWebsocketRequested(HttpHeaders requestHeaders) {
    return requestHeaders.contains("Connection", "Upgrade", true)
        && requestHeaders.contains("Upgrade", "websocket", true);
  }

  public abstract HttpServer setupSsl(HttpServer server, SslContext sslContext);

  @Override
  public void stop() {
    logger.info("Stopping server");

    server.disposeNow();
    status.set(Status.STOPPED);
    logger.info("Stopped server");
  }

  @PreDestroy
  public void shutdownGracefully() {
    new GracefulShutdown(() -> this)
        .shutDownGracefully((GracefulShutdownResult gsr) -> logger.info(gsr.toString()));
  }

  @Override
  public Health health() {
    var builder = new Health.Builder();
    builder.withDetail("listeningHost", listeningHost);
    builder.withDetail("listeningPort", listeningPort);
    builder.withDetail("status", status.get());
    if (status.get() == Status.STARTED) {
      builder.up();
    } else {
      builder.down();
    }
    return builder.build();
  }

  private enum Status {
    CREATED,
    STARTED,
    STOPPED
  }
}
