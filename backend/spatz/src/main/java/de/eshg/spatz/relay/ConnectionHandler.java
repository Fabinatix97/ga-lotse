/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import java.io.IOException;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConnectionHandler {

  private static final Logger logger = LoggerFactory.getLogger(ConnectionHandler.class);

  private final Selector selector;

  public ConnectionHandler(Selector selector) {
    this.selector = selector;
  }

  private final Object mutex = new Object();
  private final ConcurrentHashMap<UUID, SocketChannel> byId = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<SocketChannel, ConnectionMetaData> byChannel =
      new ConcurrentHashMap<>();

  public void add(SocketChannel socketChannel, UUID connectionId) {
    add(socketChannel, connectionId, null);
  }

  public void add(SocketChannel socketChannel, UUID connectionId, String targetSni) {
    ConnectionMetaData meta = new ConnectionMetaData(connectionId, targetSni);
    synchronized (mutex) {
      byId.put(connectionId, socketChannel);
      byChannel.put(socketChannel, meta);
    }
    logger.info("connection added - total connections: {}", byId.size());
  }

  public ConnectionMetaData getMetadata(SocketChannel channel) {
    return Objects.requireNonNull(byChannel.get(channel));
  }

  public SocketChannel getSocketChannel(UUID connectionId) {
    return byId.get(connectionId);
  }

  public void close(SelectionKey key) {
    key.cancel();
    try {
      key.channel().close();
    } catch (IOException e) {
      logger.warn("ignoring error while closing connection: {}", e.toString());
    } finally {
      synchronized (mutex) {
        ConnectionMetaData meta = byChannel.remove(key.channel());
        if (meta != null) {
          byId.remove(meta.getConnectionId());
        }
      }
    }
    logger.info("connection closed - total connections: {}", byId.size());
  }

  public void close(UUID connectionId) {
    SocketChannel socketChannel = byId.get(connectionId);
    if (socketChannel != null) {
      SelectionKey key = socketChannel.keyFor(selector);
      if (key != null) {
        close(key);
      }
    }
  }
}
