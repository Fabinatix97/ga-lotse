/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server.inbound;

import de.eshg.lib.common.EshgHttpHeaders;
import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.servicedirectory.util.X509Utils;
import de.eshg.spatz.LifecyclePhases;
import de.eshg.spatz.client.HttpProxyClient;
import de.eshg.spatz.common.CustomHeaders;
import de.eshg.spatz.common.ServiceDirectoryTopologyService.TopologyChangedListener;
import de.eshg.spatz.common.ServiceDirectoryTopologyService.TrustedActors;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import de.eshg.spatz.server.ProxyServer;
import de.eshg.spatz.server.WebsocketProxyHandler;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslHandler;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import org.reactivestreams.Publisher;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import reactor.netty.ByteBufFlux;
import reactor.netty.http.client.HttpClientResponse;
import reactor.netty.http.server.HttpServer;
import reactor.netty.http.server.HttpServerRequest;
import reactor.netty.http.server.HttpServerResponse;

/**
 * Inbound server handles traffic from the outside (i.e. another SPATZ) to the module within the
 * same pod (localhost). The secure tunnel between the calling SPATZ and this server will be
 * terminated and the content passed on to the module at localhost on inboundTargetPort.
 */
@Component
public class InboundServer extends ProxyServer implements TopologyChangedListener {

  public static final String INBOUND_RESPONSE_HANDLED = "success";
  private final int inboundTargetPort;
  private final String inboundTargetHost;
  private final Optional<ServiceDirectoryApi> serviceDirectoryApi;
  private final WebsocketProxyHandler websocketProxyHandler = new WebsocketProxyHandler();
  private final HttpProxyClient httpProxyClient;
  private Map<String, ActorResponseDto> actorsByHostname = Collections.emptyMap();
  private ActorResponseDto self;

  public InboundServer(
      ApplicationContext applicationContext,
      HttpServer baseServer,
      SpatzConfigurationProperties properties,
      SslBundles sslBundles,
      Optional<ServiceDirectoryApi> serviceDirectoryApi,
      LifecycleProperties lifecycleProperties) {
    super(
        applicationContext,
        baseServer,
        properties.inbound().listeningHost(),
        properties.inbound().handlerPort(),
        properties.inbound().forceClientAuth(),
        Optional.ofNullable(properties.inbound().clientCnAllowList()).orElse(List.of()),
        sslBundles,
        lifecycleProperties);
    this.inboundTargetPort = properties.inbound().targetPort();
    this.inboundTargetHost =
        properties.inbound().targetHost() != null ? properties.inbound().targetHost() : "localhost";
    this.serviceDirectoryApi = serviceDirectoryApi;
    httpProxyClient = new HttpProxyClient(inboundTargetHost, inboundTargetPort);
  }

  @Override
  protected Publisher<Void> handlerFunction(HttpServerRequest in, HttpServerResponse out) {
    AtomicReference<String[][]> headersHolder = new AtomicReference<>(new String[0][0]);

    if (isClientAuth()) {
      in.withConnection(
          connection -> {
            try {
              X509Certificate peerCertificate =
                  (X509Certificate)
                      connection
                          .channel()
                          .pipeline()
                          .get(SslHandler.class)
                          .engine()
                          .getSession()
                          .getPeerCertificates()[0];
              logger.trace("client presented the following mTLS certificate: {}", peerCertificate);

              ArrayList<String[]> headers = new ArrayList<>();
              headers.add(
                  new String[] {
                    EshgHttpHeaders.X_ESHG_CERT_TYPE.headerName, peerCertificate.getType()
                  });
              headers.add(
                  new String[] {
                    EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName,
                    peerCertificate.getSubjectX500Principal().getName()
                  });

              String peerCommonName = X509Utils.extractSanOrCommonName(peerCertificate);
              ActorResponseDto senderActor = actorsByHostname.get(peerCommonName);
              if (senderActor != null) {
                headers.add(
                    new String[] {
                      EshgHttpHeaders.X_ESHG_SENDER_ORGUNIT.headerName,
                      senderActor.orgUnitId().toString()
                    });
              } else if (!getClientCnAllowList().contains(peerCommonName)) {
                throw new SslCertificateException(
                    "Rejecting certificate with CN "
                        + peerCommonName
                        + " not in valid active inbound actors or client CN allow list");
              }

              ActorResponseDto currentSelf = self;
              if (currentSelf != null) {
                headers.add(
                    new String[] {
                      EshgHttpHeaders.X_ESHG_TARGET_ORGUNIT.headerName,
                      currentSelf.orgUnitId().toString()
                    });
              }

              if (peerCertificate.getSubjectAlternativeNames() != null) {
                peerCertificate.getSubjectAlternativeNames().stream()
                    .map(
                        l ->
                            new String[] {
                              EshgHttpHeaders.X_ESHG_CERT_SAN.headerName, l.getLast().toString()
                            })
                    .forEach(headers::add);
              }

              headersHolder.set(headers.toArray(String[][]::new));
            } catch (Exception e) {
              if (e instanceof SslCertificateException) throw (SslCertificateException) e;
              throw new SslCertificateException("could not parse client certificate: " + e, e);
            }
          });
    }

    String uri = in.uri();
    HttpMethod method = in.method();
    String scheme = in.scheme();
    String protocol = in.protocol();

    HttpHeaders requestHeaders = sanitizeHeaders(in, headersHolder);

    Consumer<? super HttpHeaders> headers = h -> h.set(requestHeaders);

    logger.debug(
        "proxying inbound request to hostName={}, port={}, uri={}, method={}, scheme={},"
            + " protocol={}, isWebsocket={}",
        inboundTargetHost,
        inboundTargetPort,
        uri,
        method,
        scheme,
        protocol,
        in.isWebsocket());

    if (isWebsocketRequested(requestHeaders)) {
      logger.debug("websocket requested by inbound caller");
      return out.sendWebsocket(
              (in1, out1) ->
                  httpProxyClient
                      .connectWebsocket(uri, headers)
                      .handle((in2, out2) -> websocketProxyHandler.handle(in1, out1, in2, out2))
                      .doOnComplete(() -> logger.trace("outbound client completed"))
                      .doOnError(err -> logger.error("outbound client error", err)))
          .then()
          .doAfterTerminate(() -> logger.trace("upgraded outbound request to websockets"))
          .then();
    } else {
      return httpProxyClient
          .connect(uri, method, headers)
          .send(in.receive().retain())
          .response(
              (httpClientResponse, byteBufFlux) ->
                  handleResponse(httpClientResponse, byteBufFlux, out))
          .doOnComplete(() -> logger.trace("inbound proxy client request to {} completed", uri))
          .doOnError(
              err ->
                  logger.error(
                      "error sending inbound proxy client request to {}:{}", uri, err.toString()))
          .then();
    }
  }

  private static HttpHeaders sanitizeHeaders(
      HttpServerRequest in, AtomicReference<String[][]> headersHolder) {
    HttpHeaders requestHeaders = in.requestHeaders();
    // do not allow fake header values from client
    for (EshgHttpHeaders header : EshgHttpHeaders.values()) {
      requestHeaders = requestHeaders.remove(header.headerName);
    }
    // add real header values from peerCertificate
    for (String[] entries : headersHolder.get()) {
      requestHeaders = requestHeaders.add(entries[0], entries[1]);
    }
    return requestHeaders;
  }

  private Publisher<Void> handleResponse(
      HttpClientResponse httpClientResponse, ByteBufFlux byteBufFlux, HttpServerResponse out) {
    logger.trace(
        "inbound server: client response: isWebsocket: {}, status: {}, headers: {}",
        httpClientResponse.isWebsocket(),
        httpClientResponse.status().code(),
        httpClientResponse.responseHeaders());

    return out.status(httpClientResponse.status())
        .headers(httpClientResponse.responseHeaders())
        .addHeader(CustomHeaders.X_SPATZ_INBOUND.kebabName, INBOUND_RESPONSE_HANDLED)
        .send(byteBufFlux.retain());
  }

  @Override
  public HttpServer setupSsl(HttpServer server, SslContext sslContext) {
    return server.secure(spec -> spec.sslContext(sslContext));
  }

  @Override
  public void trustedActorsChanged(TrustedActors trustedActors) {
    actorsByHostname = trustedActors.inboundByHostname();
    if (serviceDirectoryApi.isEmpty()) {
      logger.warn(
          "no eshg.servicedirectory.baseUrl configured. {} will not be set.",
          EshgHttpHeaders.X_ESHG_TARGET_ORGUNIT.headerName);
      return;
    }
    try {
      self = serviceDirectoryApi.get().getSelf();
    } catch (Exception e) {
      logger.info("could not get own actor information: {}", e.getMessage());
      self = null;
    }
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.INBOUND_SERVER.phase;
  }
}
