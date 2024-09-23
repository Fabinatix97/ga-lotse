/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

import io.netty.channel.epoll.Epoll;
import io.netty.channel.epoll.EpollDatagramChannel;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.resolver.dns.DnsAddressResolverGroup;
import io.netty.resolver.dns.DnsNameResolverBuilder;
import io.netty.resolver.dns.SequentialDnsServerAddressStreamProvider;
import io.netty.resolver.dns.SingletonDnsServerAddressStreamProvider;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;

public class ResolverFactory {

  private ResolverFactory() {}

  public static DnsAddressResolverGroup useUpstreamDns(InetSocketAddress dnsAddress) {
    return new DnsAddressResolverGroup(
        new DnsNameResolverBuilder()
            .channelType(
                Epoll.isAvailable() ? EpollDatagramChannel.class : NioDatagramChannel.class)
            .nameServerProvider(new SingletonDnsServerAddressStreamProvider(dnsAddress)));
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
            .channelType(
                Epoll.isAvailable() ? EpollDatagramChannel.class : NioDatagramChannel.class)
            .hostsFileEntriesResolver((inetHost, resolvedAddressTypes) -> resolvedInetAddress)
            .nameServerProvider(new SequentialDnsServerAddressStreamProvider(resolvedAddress)));
  }
}
