/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server.outbound;

import static org.apache.logging.log4j.util.Strings.isBlank;

import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.spatz.LifecyclePhases;
import de.eshg.spatz.client.HttpProxyClient;
import de.eshg.spatz.common.CustomHeaders;
import de.eshg.spatz.common.ServiceDirectoryTopologyService.TopologyChangedListener;
import de.eshg.spatz.common.ServiceDirectoryTopologyService.TrustedActors;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import de.eshg.spatz.relay.RelayDestinationPredicate;
import de.eshg.spatz.server.ProxyServer;
import de.eshg.spatz.server.ResolverFactory;
import de.eshg.spatz.server.WebsocketProxyHandler;
import io.netty.channel.ChannelHandler.Sharable;
import io.netty.handler.address.DynamicAddressConnectHandler;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.ssl.SslContext;
import io.netty.resolver.dns.DnsAddressResolverGroup;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import javax.net.ssl.SSLHandshakeException;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.ApplicationContext;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.netty.ByteBufFlux;
import reactor.netty.http.client.HttpClientResponse;
import reactor.netty.http.server.HttpServer;
import reactor.netty.http.server.HttpServerRequest;
import reactor.netty.http.server.HttpServerResponse;

/**
 * Outbound server handles traffic from within a pod (i.e. a module) to another module by connecting
 * with the opposite SPATZ and creating a save tunnel between both SPATZ
 */
@Component
public final class OutboundServer extends ProxyServer {

  private static final Logger logger = LoggerFactory.getLogger(OutboundServer.class);
  public static final String OUTBOUND_RESPONSE_HANDLED = "success";
  public static final String OUTBOUND_RESPONSE_FAILURE = "failure";
  public static final String OUTBOUND_RESPONSE_SSL_HANDSHAKE_EXCEPTION =
      SSLHandshakeException.class.getSimpleName();
  public static final String X_ESHG_HOST = "x-eshg-host";

  private final int outboundTargetPort;
  private final RelayAddressMapper addressMapper;
  private final WebsocketProxyHandler websocketProxyHandler = new WebsocketProxyHandler();
  private final HttpProxyClient httpProxyClient;

  public OutboundServer(
      ApplicationContext applicationContext,
      HttpServer baseServer,
      SpatzConfigurationProperties properties,
      SslBundles sslBundles,
      RelayAddressMapper addressMapper,
      LifecycleProperties lifecycleProperties) {
    super(
        applicationContext,
        baseServer,
        properties.outbound().listeningHost(),
        properties.outbound().handlerPort(),
        true,
        List.of(),
        sslBundles,
        lifecycleProperties);
    this.outboundTargetPort = properties.outbound().targetPort();
    this.addressMapper = addressMapper;

    DnsAddressResolverGroup resolver =
        ResolverFactory.useUpstreamDns(properties.dns().upstreamHost());
    httpProxyClient = new HttpProxyClient(OutboundServer.this.addressMapper, resolver);
  }

  @Override
  protected Publisher<Void> handlerFunction(HttpServerRequest in, HttpServerResponse out) {

    int hostPort = outboundTargetPort;

    String uri = in.uri();
    HttpMethod method = in.method();
    String scheme = in.scheme();
    String protocol = in.protocol();
    HttpHeaders headers = in.requestHeaders();

    String eshgHostHeader = headers.get(X_ESHG_HOST);
    String hostName = isBlank(eshgHostHeader) ? in.hostName() : eshgHostHeader;

    logger.debug(
        "proxying outbound request for hostName={}, port={}, uri={}, method={}, scheme={},"
            + " protocol={}",
        hostName,
        hostPort,
        uri,
        method,
        scheme,
        protocol);

    if (isWebsocketRequested(headers)) {
      logger.debug("websocket requested by inbound caller");
      return out.sendWebsocket(
              (in1, out1) ->
                  httpProxyClient
                      .connectWebsocket(
                          hostName, hostPort, uri, getHeaderConsumer(headers), getClientContext())
                      .handle((in2, out2) -> websocketProxyHandler.handle(in1, out1, in2, out2))
                      .doOnComplete(() -> logger.trace("inbound client completed"))
                      .onErrorResume(handleOutboundError(uri, out)))
          .then()
          .doAfterTerminate(() -> logger.trace("upgraded inbound request to websockets"))
          .then();
    } else {

      return httpProxyClient
          .connect(hostName, hostPort, uri, method, getHeaderConsumer(headers), getClientContext())
          .send(in.receive().retain())
          .response(
              (httpClientResponse, byteBufFlux) ->
                  handleResponse(httpClientResponse, byteBufFlux, out))
          .onErrorResume(handleOutboundError(uri, out))
          .doOnComplete(() -> logger.debug("outbound proxy client request to {} completed", uri))
          .then();
    }
  }

  @Override
  public HttpServer setupSsl(HttpServer server, SslContext sslContext) {
    return server;
  }

  private Consumer<HttpHeaders> getHeaderConsumer(HttpHeaders headers) {
    return h -> {
      h.set(headers);
      h.remove(X_ESHG_HOST);
    };
  }

  private Publisher<Void> handleResponse(
      HttpClientResponse httpClientResponse, ByteBufFlux byteBufFlux, HttpServerResponse out) {
    return out.status(httpClientResponse.status())
        .headers(httpClientResponse.responseHeaders())
        .addHeader(CustomHeaders.X_SPATZ_OUTBOUND.kebabName, OUTBOUND_RESPONSE_HANDLED)
        .send(byteBufFlux.retain());
  }

  private Function<Throwable, Publisher<Void>> handleOutboundError(
      String uri, HttpServerResponse out) {
    return err -> {
      Throwable rootCause = NestedExceptionUtils.getMostSpecificCause(err);
      HttpResponseStatus status;
      if (rootCause instanceof SSLHandshakeException) {
        logger.trace("SSL handshake failed", err);
        logger.info(
            "SSL handshake failed (still in startup?) --> ignoring {}, {}",
            err.getMessage(),
            rootCause.getMessage());
        status = HttpResponseStatus.NETWORK_AUTHENTICATION_REQUIRED;
      } else {
        logger.error("outbound error to {}:", uri, err);
        status = HttpResponseStatus.INTERNAL_SERVER_ERROR;
      }
      return out.status(status)
          .addHeader(CustomHeaders.X_SPATZ_OUTBOUND.kebabName, OUTBOUND_RESPONSE_FAILURE)
          .sendString(
              Mono.just(OUTBOUND_RESPONSE_SSL_HANDSHAKE_EXCEPTION + " " + rootCause.getMessage()));
    };
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.OUTBOUND_SERVER.phase;
  }

  @Component
  @Sharable
  public static class RelayAddressMapper extends DynamicAddressConnectHandler
      implements TopologyChangedListener {

    private final boolean relayEnabled;
    private final ServiceDirectoryApi serviceDirectoryApi;
    private final InetSocketAddress relayTargetAddress;
    private Map<String, ActorResponseDto> hostNameToActiveActor = Collections.emptyMap();
    private ActorResponseDto self = null;
    private final RelayDestinationPredicate relayDestinationPredicate =
        new RelayDestinationPredicate();

    public RelayAddressMapper(
        SpatzConfigurationProperties properties, ServiceDirectoryApi serviceDirectoryApi) {
      this.relayEnabled = properties.relay().enabled();
      this.serviceDirectoryApi = serviceDirectoryApi;
      if (this.relayEnabled) {
        relayTargetAddress =
            new InetSocketAddress(
                properties.relay().listenHost().equals("0.0.0.0")
                    ? "127.0.0.1"
                    : properties.relay().listenHost(),
                properties.relay().listenPort());
      } else {
        relayTargetAddress = null;
      }
    }

    @Override
    protected SocketAddress remoteAddress(SocketAddress remoteAddress, SocketAddress localAddress) {
      if (!relayEnabled) {
        logger.trace("relaying not enabled - NOOP");
        return remoteAddress;
      }

      String hostName = ((InetSocketAddress) remoteAddress).getHostName();
      if (isRelayDestination(hostName)) {
        logger.debug("{} is a relay target. mapping to {}", remoteAddress, relayTargetAddress);
        return relayTargetAddress;
      } else {
        logger.debug("{} is NOT a relay target", remoteAddress);
        return remoteAddress;
      }
    }

    public boolean isRelayDestination(String hostName) {
      ActorResponseDto remoteActor = hostNameToActiveActor.get(hostName);
      return relayDestinationPredicate.test(remoteActor, self);
    }

    @Override
    public void trustedActorsChanged(TrustedActors trustedActors) {
      if (this.relayEnabled) {
        hostNameToActiveActor = trustedActors.outboundByHostname();
        self = serviceDirectoryApi.getSelf();
      }
    }
  }
}
