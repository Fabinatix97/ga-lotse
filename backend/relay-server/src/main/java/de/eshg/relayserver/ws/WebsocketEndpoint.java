/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver.ws;

import de.eshg.lib.common.EshgHttpHeaders;
import de.eshg.lib.relay.MessageType;
import de.eshg.lib.relay.SNIParser;
import de.eshg.lib.relay.UUIDParser;
import jakarta.websocket.CloseReason;
import jakarta.websocket.CloseReason.CloseCodes;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.PongMessage;
import jakarta.websocket.Session;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.ClosedChannelException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebsocketEndpoint {

  private static final Logger logger = LoggerFactory.getLogger(WebsocketEndpoint.class);
  private static final Map<String, WebsocketEndpoint> chatEndpoints = new ConcurrentHashMap<>();
  private static boolean shutDown = false;
  private static final ReentrantLock lock = new ReentrantLock();

  private Session session;
  private String sni;

  private final AtomicReference<String> outstandingPingPayload = new AtomicReference<>();

  @OnOpen
  public void onOpen(Session session, EndpointConfig epc) throws IOException {
    this.session = session;
    this.sni =
        getPreAuthenticatedPrincipal(
            (String) epc.getUserProperties().get(EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName));
    if (this.sni == null) {
      session.close(
          new CloseReason(
              CloseCodes.CANNOT_ACCEPT,
              "no authentication information found for connection. "
                  + EshgHttpHeaders.X_ESHG_CERT_SUBJECT
                  + " header is missing/invalid"));
      return;
    }
    WebsocketEndpoint existing;
    lock.lock();
    try {
      if (shutDown) {
        session.close(new CloseReason(CloseCodes.GOING_AWAY, "RelayServer shutdown"));
        return;
      }
      existing = chatEndpoints.putIfAbsent(this.sni, this);
    } finally {
      lock.unlock();
    }
    if (existing != null) {
      logger.warn(
          "connection not opened for '{}' (peer already connected) - total connections: {}",
          this.sni,
          chatEndpoints.size());
      session.close(
          new CloseReason(
              CloseReason.CloseCodes.CANNOT_ACCEPT, "peer '" + this.sni + "' already connected"));
    } else {
      logger.info(
          "connection opened for '{}' - total connections: {}", this.sni, chatEndpoints.size());
    }
  }

  @OnMessage
  public void onPong(PongMessage pongMessage) {
    String pongPayload = StandardCharsets.UTF_8.decode(pongMessage.getApplicationData()).toString();
    logger.debug("Received pong with applicationData {} for sni {}", pongPayload, this.sni);
    if (!pongPayload.equals(outstandingPingPayload.get())) {
      logger.warn(
          "Payload mismatch: expected {}. Ignoring pong for sni {}",
          outstandingPingPayload.get(),
          this.sni);
      return;
    }
    outstandingPingPayload.set(null);
  }

  @OnMessage
  public void onMessage(ByteBuffer buffer) throws IOException {
    int messageSize = buffer.limit() - buffer.position();
    UUID connectionId = UUIDParser.readUUID(buffer);
    buffer.get();
    String sourceSni = checkSniMatch(SNIParser.readSNI(buffer));
    String targetSni = SNIParser.readSNI(buffer);
    logger.trace("received message from {} to {} ({} byte)", sourceSni, targetSni, messageSize);
    buffer.position(0);
    WebsocketEndpoint server = chatEndpoints.get(targetSni);
    if (server != null) {
      server.session.getBasicRemote().sendBinary(buffer);
    } else {
      logger.error(
          "cannot deliver message on connection {} from {} to {}: {} not connected",
          connectionId,
          sourceSni,
          targetSni,
          targetSni);
      sendHostNotOnline(connectionId, sourceSni, targetSni);
    }
  }

  private String checkSniMatch(String sni) throws IOException {
    if (!this.sni.matches(sni)) {
      throw new IOException(
          "message header error: sni '" + sni + "' must match configured SNI '" + this.sni + "'");
    }
    return sni;
  }

  private void sendHostNotOnline(UUID connectionId, String sourceSni, String targetSni)
      throws IOException {
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    UUIDParser.write(connectionId, buffer);
    buffer.put((byte) 0);
    buffer.put(targetSni.getBytes(StandardCharsets.UTF_8));
    buffer.put((byte) 0);
    buffer.put(sourceSni.getBytes(StandardCharsets.UTF_8));
    buffer.put((byte) 0);
    buffer.put(MessageType.HOST_NOT_ONLINE.getByte());

    buffer.flip();
    session.getBasicRemote().sendBinary(buffer);
  }

  @OnClose
  public void onClose(CloseReason closeReason) {
    String peer = (this.sni == null ? "unkown peer" : this.sni);

    if (chatEndpoints.remove(peer, this)) {
      logger.info(
          "connection closed for {} due to {} - {} total connections",
          peer,
          closeReason,
          chatEndpoints.size());
    } else {
      logger.warn(
          "unknown connection closed for {} due to {} - {} total connections",
          peer,
          closeReason,
          chatEndpoints.size());
    }
  }

  @OnError
  public void onError(Throwable throwable) {
    try {
      throw throwable;
    } catch (ClosedChannelException ex) {
      logger.info("channel closed for sni {}", this.sni);
    } catch (Error e) {
      logger.error("error occurred for user {}:", this.sni, throwable);
      throw e;
    } catch (Throwable e) {
      logger.error("error occurred for user {}:", this.sni, throwable);
      logger.error("error occurred while processing the previous error for user {}:", this.sni, e);
    }
  }

  public int getClientCount() {
    return chatEndpoints.size();
  }

  private String getPreAuthenticatedPrincipal(String subject) {
    if (subject == null || subject.isBlank()) {
      return null;
    }
    if (subject.startsWith("CN=")) {
      return subject.substring(3);
    } else {
      return null;
    }
  }

  private void ping() {
    if (outstandingPingPayload.get() != null) {
      logger.warn(
          "No pong from client for sni {} with payload {} in 20 seconds. Closing connection",
          this.sni,
          outstandingPingPayload.get());
      try {
        session.close(
            new CloseReason(CloseCodes.getCloseCode(4000), "No pong from client in 20 seconds"));
      } catch (IOException e) {
        logger.error("Error closing connection for sni {}", this.sni, e);
      }
      return;
    }
    String id = UUID.randomUUID().toString();
    logger.debug("Sending ping for sni {} with payload {}", this.sni, id);
    try {
      session.getBasicRemote().sendPing(ByteBuffer.wrap(id.getBytes(StandardCharsets.UTF_8)));
      outstandingPingPayload.set(id);
    } catch (Exception e) {
      logger.error("Error sending ping for sni {}", this.sni, e);
    }
  }

  private void close() {
    try {
      session.close(new CloseReason(CloseCodes.GOING_AWAY, "RelayServer shutdown"));
    } catch (IOException e) {
      logger.error("Error closing connection for sni {}", this.sni, e);
    }
  }

  public static void sendPingsToAll() {
    chatEndpoints.values().forEach(WebsocketEndpoint::ping);
  }

  public static void closeAllConnections() {
    lock.lock();
    try {
      logger.info("Closing {} open WebSocket connections.", chatEndpoints.size());
      shutDown = true;
      chatEndpoints.values().forEach(WebsocketEndpoint::close);
    } finally {
      lock.unlock();
    }
  }
}
