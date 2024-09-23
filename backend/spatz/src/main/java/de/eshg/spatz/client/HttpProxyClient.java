/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.client;

import de.eshg.spatz.server.outbound.OutboundServer.RelayAddressMapper;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.ssl.SslContext;
import io.netty.resolver.dns.DnsAddressResolverGroup;
import java.net.InetSocketAddress;
import java.util.function.Consumer;
import javax.net.ssl.SNIHostName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.netty.http.client.HttpClient;
import reactor.netty.http.client.HttpClient.RequestSender;
import reactor.netty.http.client.HttpClient.WebsocketSender;

/** HTTP proxy client, used in handlerFunction of ProxyServer to connect to target. */
public class HttpProxyClient {

  private static final Logger log = LoggerFactory.getLogger(HttpProxyClient.class);

  private final HttpClient httpClient;

  public HttpProxyClient(RelayAddressMapper addressMapper, DnsAddressResolverGroup resolver) {
    this.httpClient =
        HttpClient.create()
            .doOnChannelInit(
                (connectionObserver, channel, remoteAddress) ->
                    // use custom address mapper to allow redirecting outbound SSL via
                    // relay-server (maps host _and_ port)
                    channel.pipeline().addLast(addressMapper))
            // use upstream DNS resolver to resolve real IPs
            .resolver(resolver);
  }

  public HttpProxyClient(String host, int port) {
    this.httpClient = HttpClient.create().host(host).port(port);
  }

  /**
   * Create and return a new connection. Said connection will come in a {@code Mono}, to allow
   * subscribing asynchronously.
   *
   * @return a {@code Mono} for the client connection
   */
  public RequestSender connect(
      String uri, HttpMethod method, Consumer<? super HttpHeaders> headersConsumer) {

    return connect(uri, method, headersConsumer, httpClient);
  }

  public RequestSender connect(
      final String host,
      final Integer port,
      String uri,
      HttpMethod method,
      Consumer<? super HttpHeaders> headersConsumer,
      SslContext sslContext) {

    return connect(uri, method, headersConsumer, setupSsl(sslContext, host).host(host).port(port));
  }

  private static RequestSender connect(
      String uri,
      HttpMethod method,
      Consumer<? super HttpHeaders> headersConsumer,
      HttpClient httpClient) {
    log.info("Starting proxy client");

    logConnecting(uri, httpClient);

    return httpClient.headers(headersConsumer).request(method).uri(uri);
  }

  public WebsocketSender connectWebsocket(
      String uri, Consumer<? super HttpHeaders> headersConsumer) {

    return connectWebsocket(uri, headersConsumer, httpClient);
  }

  public WebsocketSender connectWebsocket(
      final String host,
      final Integer port,
      String uri,
      Consumer<? super HttpHeaders> headersConsumer,
      SslContext sslContext) {
    return connectWebsocket(uri, headersConsumer, setupSsl(sslContext, host).host(host).port(port));
  }

  private static WebsocketSender connectWebsocket(
      String uri, Consumer<? super HttpHeaders> headersConsumer, HttpClient httpClient) {
    log.info("Starting proxy client in ws mode");

    logConnecting(uri, httpClient);

    return httpClient.headers(headersConsumer).websocket().uri(uri);
  }

  private HttpClient setupSsl(SslContext sslContext, final String host) {
    return httpClient.secure(
        spec ->
            spec.sslContext(sslContext)
                // send SNI headers
                .serverNames(new SNIHostName(host)));
  }

  private static void logConnecting(String uri, HttpClient httpClient) {
    InetSocketAddress address;
    try {
      address = (InetSocketAddress) httpClient.configuration().remoteAddress().get();
    } catch (ClassCastException cce) {
      log.warn("Unexpected SocketAddress type", cce);
      return;
    }
    log.info("Connecting to {}:{}{}", address.getHostString(), address.getPort(), uri);
  }
}
