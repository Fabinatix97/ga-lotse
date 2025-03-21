/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver.ws;

import static de.eshg.lib.relay.MessageHeader.writeHeader;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.RemovalNotification;
import de.eshg.lib.common.EshgHttpHeaders;
import de.eshg.lib.relay.MessageType;
import de.eshg.lib.relay.SNIParser;
import de.eshg.lib.relay.UUIDParser;
import de.eshg.servicedirectory.util.X509Utils;
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
import java.time.Duration;
import java.util.Collection;
import java.util.Deque;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebsocketEndpoint {

  private static final Logger logger = LoggerFactory.getLogger(WebsocketEndpoint.class);

  private static final Map<String, WebsocketEndpointDeque> endpoints = new ConcurrentHashMap<>();
  private static final Cache<UUID, ActiveConnection> activeConnections =
      CacheBuilder.newBuilder()
          .expireAfterAccess(Duration.ofDays(1))
          .removalListener(WebsocketEndpoint::onActiveConnectionRemoval)
          .build();

  private static boolean shutDown = false;
  private static final ReentrantLock lock = new ReentrantLock();

  private Session session;
  private String sni;
  private String location;

  private final AtomicReference<String> outstandingPingPayload = new AtomicReference<>();

  @OnOpen
  public void onOpen(Session session, EndpointConfig epc) throws IOException {
    this.session = session;
    Map<String, String> subject = getSubject(epc.getUserProperties());
    sni = subject.get("CN");
    if (sni == null) {
      session.close(
          new CloseReason(
              CloseCodes.CANNOT_ACCEPT,
              "no authentication information found for connection. "
                  + EshgHttpHeaders.X_ESHG_CERT_SUBJECT
                  + " header is missing/invalid"));
      return;
    }
    location = subject.get("L");
    if (location == null || location.isBlank()) {
      logger.warn("Connection without distinguishing location: {}", sni);
    }
    boolean existing;
    lock.lock();
    try {
      if (shutDown) {
        session.close(new CloseReason(CloseCodes.GOING_AWAY, "RelayServer shutdown"));
        return;
      }
      existing =
          !endpoints.computeIfAbsent(sni, unused -> new WebsocketEndpointDeque()).addEndpoint(this);
    } finally {
      lock.unlock();
    }
    if (existing) {
      logger.warn(
          "connection not opened for {} (peer already connected) - {}", this, connectionStats());
      session.close(
          new CloseReason(
              CloseReason.CloseCodes.CANNOT_ACCEPT, "peer '" + sni + "' already connected"));
    } else {
      logger.info("connection opened for {} - {}", this, connectionStats());
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
    MessageType messageType = MessageType.ofByte(buffer.get());
    logger.trace(
        "received {} message from {} to {} ({} byte)", messageType, this, targetSni, messageSize);
    buffer.position(0);
    ActiveConnection activeConnection = activeConnections.getIfPresent(connectionId);
    if (messageType == MessageType.CONNECTION_CLOSED) {
      activeConnections.invalidate(connectionId);
    }
    if (activeConnection != null) {
      logger.trace(
          "message is {}-part of existing connection",
          activeConnection.client() == this ? "request" : "response");
      WebsocketEndpoint endpoint = activeConnection.getOther(this);
      if (endpoint != null) {
        endpoint.session.getBasicRemote().sendBinary(buffer);
        return;
      }
    }
    WebsocketEndpoint endpoint =
        Optional.ofNullable(endpoints.get(targetSni))
            .map(WebsocketEndpointDeque::rotateAndGet)
            .orElse(null);
    if (endpoint != null) {
      if (messageType == MessageType.CONNECTION_CLOSED) {
        logger.warn(
            "new connection with connection closed message to {} - {} total active connections",
            endpoint,
            activeConnections.size());
      } else {
        logger.trace(
            "starting new connection to {} - {} total active connections",
            endpoint,
            activeConnections.size());
        activeConnections.put(connectionId, new ActiveConnection(this, endpoint));
      }
      endpoint.session.getBasicRemote().sendBinary(buffer);
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
    writeHeader(buffer, connectionId, targetSni, sourceSni, MessageType.HOST_NOT_ONLINE);

    buffer.flip();
    session.getBasicRemote().sendBinary(buffer);
  }

  @OnClose
  public void onClose(CloseReason closeReason) {
    String peer = (this.sni == null ? "unknown peer" : sni);

    boolean elementWasRemoved;
    lock.lock();
    try {
      Deque<WebsocketEndpoint> actorEndpoints = endpoints.get(peer);
      if (actorEndpoints == null) {
        locConnectionClosure(closeReason, "unknown connection");
        return;
      }
      synchronized (actorEndpoints) {
        activeConnections.asMap().values().removeIf(c -> c.has(this));
        elementWasRemoved = actorEndpoints.remove(this);
      }
      if (actorEndpoints.isEmpty()) {
        endpoints.remove(peer, actorEndpoints);
        locConnectionClosure(closeReason, "last connection");
        return;
      }
    } finally {
      lock.unlock();
    }
    locConnectionClosure(
        closeReason, elementWasRemoved ? "connection" : "unknown connection instance");
  }

  private void locConnectionClosure(CloseReason closeReason, String connectionName) {
    logger.info(
        "{} closed for {} due to {} - {}", connectionName, this, closeReason, connectionStats());
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

  public static int getClientCount() {
    return endpoints.values().stream().mapToInt(Deque::size).sum();
  }

  private static Map<String, String> getSubject(Map<String, Object> userProperties) {
    String subjectString =
        (String) userProperties.get(EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName);
    if (subjectString == null) {
      logger.error("Missing {} header", EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName);
      return Map.of();
    }
    try {
      return X509Utils.parseSubject(subjectString);
    } catch (IllegalArgumentException e) {
      logger.error("Failed to parse subject: {}", subjectString, e);
      return Map.of();
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
    endpoints.values().stream().flatMap(Collection::stream).forEach(WebsocketEndpoint::ping);
  }

  public static void closeAllConnections() {
    lock.lock();
    try {
      logger.info("Closing {} open WebSocket connections.", getClientCount());
      shutDown = true;
      endpoints.values().stream().flatMap(Collection::stream).forEach(WebsocketEndpoint::close);
    } finally {
      lock.unlock();
    }
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof WebsocketEndpoint that)) {
      return false;
    }
    return Objects.equals(sni, that.sni) && Objects.equals(location, that.location);
  }

  @Override
  public int hashCode() {
    return Objects.hash(sni, location);
  }

  @Override
  public String toString() {
    return "WebsocketEndpoint{" + "sni='" + sni + '\'' + ", location=" + location + '}';
  }

  private String connectionStats() {
    return "%d total connections; connections for actor: %d"
        .formatted(
            endpoints.size(),
            Optional.ofNullable(endpoints.get(sni)).map(ConcurrentLinkedDeque::size).orElse(0));
  }

  private static void onActiveConnectionRemoval(
      RemovalNotification<UUID, ActiveConnection> removalNotification) {
    if (!removalNotification.wasEvicted()) {
      return;
    }
    ActiveConnection activeConnection = removalNotification.getValue();
    if (activeConnection != null) {
      logger.warn(
          "Stale connection {} from {} to {} removed",
          removalNotification.getKey(),
          removalNotification.getValue().client(),
          removalNotification.getValue().server());
    } else {
      logger.warn("Stale connection {} removed", removalNotification.getKey());
    }
  }
}
