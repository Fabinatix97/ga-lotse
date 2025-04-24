/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import static de.eshg.lib.relay.MessageHeader.writeHeader;
import static de.eshg.servicedirectory.util.X509Utils.extractSanOrCommonName;
import static java.nio.channels.SelectionKey.OP_READ;

import de.eshg.lib.relay.MessageType;
import de.eshg.lib.relay.SNIParser;
import de.eshg.lib.relay.UUIDParser;
import de.eshg.spatz.common.SslBundleFactory;
import de.eshg.spatz.config.SelfSignedCertificateLatch;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import java.io.IOException;
import java.net.SocketAddress;
import java.net.URI;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.StandardCharsets;
import java.security.KeyStoreException;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
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
  private Instant lastConnectionAttempt;

  public RelayConnector(
      SelfSignedCertificateLatch latch,
      SpatzConfigurationProperties spatzConfigurationProperties,
      SslBundleFactory sslBundleFactory)
      throws KeyStoreException {
    super(
        Objects.requireNonNull(
            spatzConfigurationProperties.relay().url(),
            "relay-url must not be null if relay enabled"));
    this.latch = latch;
    this.ownSni = getOwnCommonName(spatzConfigurationProperties, sslBundleFactory);
    this.relayServerUri = spatzConfigurationProperties.relay().url();
    executorService = Executors.newScheduledThreadPool(4);
    logger.info("started RelayConnector, connecting as SNI {} to {}", ownSni, relayServerUri);
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

  public void stop(Duration shutdownTimeout) throws InterruptedException, IOException {
    logger.info("stopping RelayConnector");
    executorService.shutdown();
    executorService.awaitTermination(shutdownTimeout.toMillis(), TimeUnit.MILLISECONDS);

    if (serverSocketChannel != null) {
      serverSocketChannel.close();
    }
    if (selector != null) {
      selector.close();
    }
    close(CloseFrame.GOING_AWAY, "RelayConnector shutdown");
  }

  public void start() throws IOException {
    selector = Selector.open();
    connectionHandler = new ConnectionHandler(selector);
    lastConnectionAttempt = Instant.now();
    super.connect();

    schedulePing();
    scheduleReconnect();
    scheduleNioLoop();
    logger.info("started and connecting to {}", relayServerUri);
  }

  public boolean isRunning() {
    return selector != null && selector.isOpen();
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
          try {
            doReconnect();
          } catch (Exception ex) {
            logger.error("unexpected error during reconnect attempt", ex);
          }
        },
        0,
        1,
        TimeUnit.SECONDS);
  }

  private void doReconnect() {
    if (!isClosed()) {
      logger.trace("Not reconnecting because connection is {}.", getReadyState());
      if (lastConnectionAttempt.isBefore(Instant.now().minus(Duration.ofHours(1)))) {
        logger.info(
            "Not reconnected since {}. Connection is {}", lastConnectionAttempt, getReadyState());
      }
      return;
    }
    try {
      latch.await();
    } catch (InterruptedException e) {
      logger.warn("Reconnection attempt interrupted", e);
      Thread.currentThread().interrupt();
    }
    logger.info(
        "WS connection from {} to {} is not open - trying to reconnect",
        this.ownSni,
        this.relayServerUri);
    outstandingPingPayload.set(null);
    lastConnectionAttempt = Instant.now();
    super.reconnect();
  }

  private void schedulePing() {
    // Schedule a ping every 20 seconds; assert that pong was received before next ping is sent
    executorService.scheduleAtFixedRate(
        () -> {
          try {
            ping();
          } catch (Exception ex) {
            logger.error("unexpected error while sending ping", ex);
          }
        },
        0,
        20,
        TimeUnit.SECONDS);
  }

  private void ping() {
    if (!isOpen()) {
      logger.trace("Not sending ping because connection is not open.");
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
    logger.debug("Sending ping {}", id);
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
      writeHeader(
          writeBuffer,
          socketMeta.getConnectionId(),
          ownSni,
          socketMeta.getTargetSni(),
          MessageType.DATA);

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
    writeHeader(buffer, connectionId, ownSni, targetSni, MessageType.CONNECTION_CLOSED);

    buffer.flip();
    send(buffer);
  }

  @Override
  public void onOpen(ServerHandshake handshakedata) {
    logger.info("Opened connection");
  }

  @Override
  public void onMessage(String message) {
    logger.debug("Received String message: {}", message);
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
    try {
      close(CloseFrame.UNEXPECTED_CONDITION, ex.getMessage());
    } catch (Exception e) {
      logger.error("Error closing connection", e);
    }
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
    logger.debug("Received pong {}", f);
    String pongPayload = StandardCharsets.UTF_8.decode(f.getPayloadData()).toString();
    if (!pongPayload.equals(outstandingPingPayload.get())) {
      logger.warn("Payload mismatch: expected {}. Ignoring pong", outstandingPingPayload.get());
      return;
    }
    outstandingPingPayload.set(null);
  }

  private static String getOwnCommonName(
      SpatzConfigurationProperties spatzConfigurationProperties, SslBundleFactory sslBundleFactory)
      throws KeyStoreException {
    if (spatzConfigurationProperties.selfSigned().isEnabled()) {
      return Objects.requireNonNull(spatzConfigurationProperties.actor().hostname());
    }

    Certificate keyStoreCertificate =
        sslBundleFactory.build().getStores().getKeyStore().getCertificate("ssl");
    return extractSanOrCommonName((X509Certificate) keyStoreCertificate);
  }
}
