/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import static java.nio.channels.SelectionKey.OP_READ;

import de.eshg.lib.relay.MessageType;
import de.eshg.lib.relay.SNIParser;
import de.eshg.lib.relay.UUIDParser;
import de.eshg.spatz.config.SelfSignedCertificateLatch;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.net.SocketAddress;
import java.net.URI;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.java_websocket.WebSocket;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.framing.CloseFrame;
import org.java_websocket.framing.Framedata;
import org.java_websocket.framing.PingFrame;
import org.java_websocket.handshake.ServerHandshake;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
@Lazy
public class RelayConnector extends WebSocketClient {

  private static final Logger logger = LoggerFactory.getLogger(RelayConnector.class);

  private SocketAddress tcpListenerAddress;
  private SocketAddress remoteAddress;
  private final SelfSignedCertificateLatch latch;
  private final String ownSni;
  private final URI relayServerUri;
  private final AtomicReference<String> outstandingPingPayload = new AtomicReference<>();

  private final ScheduledExecutorService executorService;

  private final ThreadLocal<ByteBuffer> threadLocalBuffers = // NOSONAR
      ThreadLocal.withInitial(() -> ByteBuffer.allocate(8192));
  private ConnectionHandler connectionHandler;
  private Selector selector;
  private ServerSocketChannel serverSocketChannel;

  public RelayConnector(
      @Value("${eshg.spatz.relay.url}") URI relayServerUri,
      SelfSignedCertificateLatch latch,
      SpatzConfigurationProperties spatzConfigurationProperties) {
    super(relayServerUri);
    this.latch = latch;
    this.ownSni = Objects.requireNonNull(spatzConfigurationProperties.actor().hostname());
    this.relayServerUri = relayServerUri;
    executorService = Executors.newScheduledThreadPool(4);
    logger.info("started RelayConnector, connecting as SNI {} to {}", ownSni, relayServerUri);
  }

  @PostConstruct
  public void init() {
    this.setConnectionLostTimeout(0);
  }

  public void configureIncomingConnections(SocketAddress tcpListenerAddress) throws IOException {
    if (this.tcpListenerAddress != null) {
      logger.warn(
          "incoming connections already configured: listening on {}- ignoring request to listen to {}",
          this.tcpListenerAddress,
          tcpListenerAddress);
      return;
    }

    this.tcpListenerAddress = tcpListenerAddress;
    serverSocketChannel = ServerSocketChannel.open();
    serverSocketChannel.configureBlocking(false);
    serverSocketChannel.socket().bind(tcpListenerAddress);
    serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

    logger.info(
        "starting listening on {} for data that is to be relayed to {}",
        tcpListenerAddress,
        relayServerUri);
  }

  public void configureOutgoingConnections(SocketAddress remoteAddress) {
    if (this.remoteAddress != null) {
      logger.warn(
          "outgoing connections already configured: sending to {} - ignoring request to send to {}",
          this.remoteAddress,
          remoteAddress);
    } else {
      this.remoteAddress = remoteAddress;
      logger.info("data relayed from {} will be sent to {}", relayServerUri, remoteAddress);
    }
  }

  @PreDestroy
  public void stop() throws InterruptedException, IOException {
    executorService.shutdown();
    executorService.awaitTermination(5, TimeUnit.SECONDS);

    if (serverSocketChannel != null) {
      serverSocketChannel.close();
    }
    if (selector != null) {
      selector.close();
    }
    close(CloseFrame.GOING_AWAY, "RelayConnector shutdown");
  }

  @PostConstruct
  public void start() throws IOException, InterruptedException {
    selector = Selector.open();
    connectionHandler = new ConnectionHandler(selector);
    super.connect();

    schedulePing();
    scheduleReconnect();
    scheduleNioLoop();
    logger.info("started and connecting to {}", relayServerUri);
  }

  private void scheduleNioLoop() {
    executorService.submit(
        () -> {
          while (!executorService.isShutdown() && !Thread.currentThread().isInterrupted()) {
            try {
              nioLoop();
            } catch (Exception ex) {
              logger.error("unexpected error while handling incoming socket", ex);
            }
          }
        });
  }

  private void nioLoop() throws IOException {
    selector.select(50);

    Iterator<SelectionKey> keys = selector.selectedKeys().iterator();

    while (keys.hasNext()) {
      SelectionKey key = keys.next();
      keys.remove();

      // key could be invalid if for example, the client closed the connection.
      if (!key.isValid()) {
        continue;
      }

      if (key.isAcceptable()) {
        accept(key);
      }

      if (key.isReadable()) {
        read(key);
      }
    }
  }

  private void scheduleReconnect() {
    executorService.scheduleWithFixedDelay(
        () -> {
          if (isClosed()) {
            try {
              latch.await();
              logger.info(
                  "WS connection from {} to {} is not open - trying to reconnect",
                  this.ownSni,
                  this.relayServerUri);
              outstandingPingPayload.set(null);
              reconnect();
            } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
            }
          }
        },
        0,
        1,
        TimeUnit.SECONDS);
  }

  private void schedulePing() {
    // Schedule a ping every 20 seconds; assert that pong was received before next ping is sent
    executorService.scheduleAtFixedRate(this::ping, 0, 20, TimeUnit.SECONDS);
  }

  private void ping() {
    if (!isOpen()) {
      logger.trace("Not sending ping because connection is closed.");
      return;
    }
    if (outstandingPingPayload.get() != null) {
      logger.warn(
          "No pong from server with payload {} in 20 seconds. Closing connection",
          outstandingPingPayload.get());
      try {
        close(4000, "No pong from server in 20 seconds");
      } catch (Exception e) {
        logger.error("Error closing connection", e);
      }
      return;
    }
    String id = UUID.randomUUID().toString();
    logger.info("Sending ping {}", id);
    try {
      PingFrame ping = new PingFrame();
      ping.setPayload(ByteBuffer.wrap(id.getBytes(StandardCharsets.UTF_8)));
      sendFrame(ping);
      outstandingPingPayload.set(id);
    } catch (Exception e) {
      logger.error("Error sending ping", e);
    }
  }

  private void accept(SelectionKey key) throws IOException {
    ServerSocketChannel channel = (ServerSocketChannel) key.channel();
    SocketChannel socketChannel = channel.accept();
    socketChannel.configureBlocking(false);

    UUID connectionId = UUID.randomUUID();
    logger.info(
        "new incoming connection {} from {}", connectionId, socketChannel.getRemoteAddress());
    connectionHandler.add(socketChannel, connectionId);
    socketChannel.register(selector, OP_READ);
  }

  private void read(SelectionKey key) throws IOException {
    SocketChannel channel = (SocketChannel) key.channel();
    ConnectionMetaData socketMeta = connectionHandler.getMetadata(channel);
    logger.debug("read key {} ({})", key, socketMeta.getConnectionId());

    int read;
    try {
      read = channel.read(socketMeta.getReadBuffer());
    } catch (IOException e) {
      logger.warn(
          "{} while reading from {} ({}): {}",
          e.getClass(),
          socketMeta.getConnectionId(),
          remoteAddress,
          e.getMessage());
      connectionHandler.close(key);
      sendConnectionClose(socketMeta.getConnectionId(), socketMeta.getTargetSni());
      return;
    }

    if (read == -1) {
      logger.debug("EOF reached for {} ({})", socketMeta.getConnectionId(), remoteAddress);
      connectionHandler.close(key);
      sendConnectionClose(socketMeta.getConnectionId(), socketMeta.getTargetSni());
      return;
    }
    if (socketMeta.getTargetSni() == null) {
      socketMeta.setTargetSni(new SNIParser(socketMeta.getReadBuffer().duplicate().flip()).parse());
    }
    if (socketMeta.getTargetSni() != null) {
      ByteBuffer writeBuffer = threadLocalBuffers.get();
      writeBuffer.clear();
      UUIDParser.write(socketMeta.getConnectionId(), writeBuffer);
      writeBuffer.put((byte) 0);
      writeBuffer.put(ownSni.getBytes(StandardCharsets.UTF_8));
      writeBuffer.put((byte) 0);
      writeBuffer.put(socketMeta.getTargetSni().getBytes(StandardCharsets.UTF_8));
      writeBuffer.put((byte) 0);
      writeBuffer.put(MessageType.DATA.getByte());

      socketMeta.getReadBuffer().flip();
      if (writeBuffer.remaining() < socketMeta.getReadBuffer().limit()) {
        throw new IOException("buffer too small");
      }
      writeBuffer.put(socketMeta.getReadBuffer());
      socketMeta.getReadBuffer().clear();
      writeBuffer.flip();
      logger.trace("sending {} bytes to {}", read, socketMeta.getTargetSni());
      send(writeBuffer);
    }
  }

  private void sendConnectionClose(UUID connectionId, String targetSni) {
    if (targetSni == null) {
      logger.debug(
          "remote party unknown when local connection {} was closed. not sending CONNECTION_CLOSED message",
          connectionId);
      return;
    }
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    UUIDParser.write(connectionId, buffer);
    buffer.put((byte) 0);
    buffer.put(ownSni.getBytes(StandardCharsets.UTF_8));
    buffer.put((byte) 0);
    buffer.put(targetSni.getBytes(StandardCharsets.UTF_8));
    buffer.put((byte) 0);
    buffer.put(MessageType.CONNECTION_CLOSED.getByte());

    buffer.flip();
    send(buffer);
  }

  @Override
  public void onOpen(ServerHandshake handshakedata) {
    logger.info("Opened connection");
  }

  @Override
  public void onMessage(String message) {
    logger.info("Received String message: {}", message);
    onMessage(ByteBuffer.wrap(message.getBytes(StandardCharsets.UTF_8)));
  }

  @Override
  public void onMessage(ByteBuffer bytes) {
    logger.debug("received {} bytes", bytes.limit());

    UUID connectionId;
    String remoteSni;
    MessageType messageType;
    try {
      connectionId = UUIDParser.readUUID(bytes);
      bytes.get();
      remoteSni = SNIParser.readSNI(bytes);
      checkSniMatch(this.ownSni, SNIParser.readSNI(bytes));
      messageType = MessageType.ofByte(bytes.get());
    } catch (IOException e) {
      throw new IllegalArgumentException("could not parse message header: " + e, e);
    }

    switch (messageType) {
      case DATA -> onDataMessage(connectionId, remoteSni, bytes);
      case CONNECTION_CLOSED -> onConnectionClosed(connectionId, remoteSni);
      case HOST_NOT_ONLINE -> onHostNotOnlineMessage(connectionId, remoteSni);
    }
  }

  private void onHostNotOnlineMessage(UUID connectionId, String remoteSni) {
    logger.error(
        "could not transport data for connection {}: Host {} not available",
        connectionId,
        remoteSni);
    connectionHandler.close(connectionId);
  }

  private void onConnectionClosed(UUID connectionId, String remoteSni) {
    logger.info("peer connection {} was closed by {}: closing connection", connectionId, remoteSni);
    connectionHandler.close(connectionId);
  }

  private void onDataMessage(UUID connectionId, String remoteSni, ByteBuffer bytes) {
    try {
      SocketChannel socketChannel = connectionHandler.getSocketChannel(connectionId);
      if (socketChannel == null) {
        if (remoteAddress != null) {
          logger.info(
              "new outgoing connection {} from {}: connecting to {}",
              remoteSni,
              connectionId,
              remoteAddress);
          socketChannel = SocketChannel.open();

          connectionHandler.add(socketChannel, connectionId, remoteSni);
          socketChannel.configureBlocking(false);
          socketChannel.connect(remoteAddress);
          while (socketChannel.isConnectionPending()) {
            boolean connected = socketChannel.finishConnect();
            if (!connected) {
              logger.debug("waiting for connection to {}", socketChannel.getRemoteAddress());
            }
          }
          socketChannel.register(selector, OP_READ);
        } else {
          logger.warn("received data from unknown connectionId {} - ignoring", connectionId);
          return;
        }
      }

      logger.debug("retrieved data for connection {}", connectionId);
      socketChannel.write(bytes);
    } catch (IOException e) {
      logger.error("error writing to connection " + connectionId + ": " + e, e);
    }
  }

  @Override
  public void onClose(int code, String reason, boolean remote) {
    logger.info(
        "{} closed connection: code [{}], reason [{}]", remote ? "Remote" : "we", code, reason);
  }

  @Override
  public void onError(Exception ex) {
    logger.error("Error: {}", ex.toString()); // NOSONAR
    close(CloseFrame.UNEXPECTED_CONDITION, ex.getMessage());
  }

  private String checkSniMatch(String expected, String sni) throws IOException {
    if (!expected.matches(sni)) {
      throw new IOException(
          "message header error: sni '" + sni + "' must match configured SNI '" + expected + "'");
    }
    return sni;
  }

  @Override
  public String toString() {
    return "[" + this.getClass() + " (" + this.ownSni + ") via " + this.relayServerUri + "]";
  }

  @Override
  public void onWebsocketPong(WebSocket conn, Framedata f) {
    logger.info("Received pong {}", f);
    String pongPayload = StandardCharsets.UTF_8.decode(f.getPayloadData()).toString();
    if (!pongPayload.equals(outstandingPingPayload.get())) {
      logger.warn("Payload mismatch: expected {}. Ignoring pong", outstandingPingPayload.get());
      return;
    }
    outstandingPingPayload.set(null);
  }
}
