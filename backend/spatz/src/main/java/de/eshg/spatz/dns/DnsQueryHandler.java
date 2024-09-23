/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.dns;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.DatagramPacket;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.xbill.DNS.Message;

@Service
public class DnsQueryHandler extends SimpleChannelInboundHandler<DatagramPacket> {

  private static final Logger logger = LoggerFactory.getLogger(DnsQueryHandler.class);

  private final DnsResolver dnsResolver;

  public DnsQueryHandler(DnsResolver dnsResolver) {
    this.dnsResolver = dnsResolver;
  }

  @Override
  protected void channelRead0(ChannelHandlerContext ctx, DatagramPacket packet) throws IOException {
    logger.trace("Incoming packet {}", packet);

    Message request = new Message(packet.content().nioBuffer());
    logger.trace("Parsed request {}", request);

    Message response = dnsResolver.resolve(request);
    logger.trace("Responding with {}", response);

    ctx.writeAndFlush(
        new DatagramPacket(Unpooled.wrappedBuffer(response.toWire()), packet.sender()));
  }
}
