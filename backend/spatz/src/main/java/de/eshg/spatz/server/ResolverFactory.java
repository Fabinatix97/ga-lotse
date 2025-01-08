/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

import static io.micrometer.common.util.StringUtils.isBlank;

import io.netty.channel.epoll.Epoll;
import io.netty.channel.epoll.EpollDatagramChannel;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.resolver.dns.DnsAddressResolverGroup;
import io.netty.resolver.dns.DnsNameResolverBuilder;
import io.netty.resolver.dns.SequentialDnsServerAddressStreamProvider;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xbill.DNS.ResolverConfig;
import org.xbill.DNS.SimpleResolver;

public class ResolverFactory {

  private static final Logger logger = LoggerFactory.getLogger(ResolverFactory.class);

  private ResolverFactory() {}

  public static DnsAddressResolverGroup useUpstreamDns(String dnsServer) {
    DnsNameResolverBuilder dnsResolverBuilder =
        new DnsNameResolverBuilder()
            .datagramChannelType(
                Epoll.isAvailable() ? EpollDatagramChannel.class : NioDatagramChannel.class);
    List<InetSocketAddress> dnsServers = new ArrayList<>();
    if (!isBlank(dnsServer)) {
      dnsServers.add(getDnsAddress(dnsServer));
    }
    dnsServers.addAll(ResolverConfig.getCurrentConfig().servers());
    dnsResolverBuilder.nameServerProvider(new SequentialDnsServerAddressStreamProvider(dnsServers));
    return new DnsAddressResolverGroup(dnsResolverBuilder);
  }

  public static DnsAddressResolverGroup resolveConstantAddress(InetSocketAddress resolvedAddress) {
    InetAddress resolvedInetAddress;
    try {
      resolvedInetAddress = InetAddress.getByName(resolvedAddress.getHostName());
    } catch (UnknownHostException e) {
      throw new RuntimeException(e);
    }
    return new DnsAddressResolverGroup(
        new DnsNameResolverBuilder()
            .datagramChannelType(
                Epoll.isAvailable() ? EpollDatagramChannel.class : NioDatagramChannel.class)
            .hostsFileEntriesResolver((inetHost, resolvedAddressTypes) -> resolvedInetAddress)
            .nameServerProvider(new SequentialDnsServerAddressStreamProvider(resolvedAddress)));
  }

  private static InetSocketAddress getDnsAddress(String dnsServer) {
    final URI uri;
    try {
      uri = new URI("dns://" + dnsServer);
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException(e);
    }
    int port = uri.getPort() < 0 ? SimpleResolver.DEFAULT_PORT : uri.getPort();
    InetSocketAddress dnsAddress = new InetSocketAddress(uri.getHost(), port);
    logger.info("resolving outbound targets via {}}", dnsAddress);
    return dnsAddress;
  }
}
