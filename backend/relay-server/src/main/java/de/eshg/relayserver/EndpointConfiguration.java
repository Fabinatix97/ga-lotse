/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver;

import de.eshg.lib.common.EshgHttpHeaders;
import de.eshg.relayserver.ws.WebsocketEndpoint;
import jakarta.websocket.Decoder;
import jakarta.websocket.Encoder;
import jakarta.websocket.Extension;
import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class EndpointConfiguration implements ServerEndpointConfig {
  private static final Logger logger = LoggerFactory.getLogger(EndpointConfiguration.class);

  private final ServerEndpointConfig delegate;
  private final Configurator configurator;

  public EndpointConfiguration() {
    this.delegate =
        ServerEndpointConfig.Builder.create(WebsocketEndpoint.class, "/signalling").build();
    this.configurator =
        new Configurator() {
          @Override
          public void modifyHandshake(
              ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
            super.modifyHandshake(sec, request, response);

            logger.debug(
                "incoming request for {} with headers {}",
                request.getRequestURI(),
                request.getHeaders());

            for (EshgHttpHeaders value : EshgHttpHeaders.values()) {
              List<String> list = request.getHeaders().get(value.headerName);
              if (list != null && !list.isEmpty()) {
                sec.getUserProperties().put(value.headerName, list.getFirst());
                logger.trace(
                    "memorizing {}={} for {}",
                    value.headerName,
                    list.getFirst(),
                    request.getRequestURI());
              }
            }
          }
        };
  }

  @Override
  public Class<?> getEndpointClass() {
    return delegate.getEndpointClass();
  }

  @Override
  public String getPath() {
    return delegate.getPath();
  }

  @Override
  public List<String> getSubprotocols() {
    return delegate.getSubprotocols();
  }

  @Override
  public List<Extension> getExtensions() {
    return delegate.getExtensions();
  }

  @Override
  public Configurator getConfigurator() {
    return configurator;
  }

  @Override
  public List<Class<? extends Encoder>> getEncoders() {
    return delegate.getEncoders();
  }

  @Override
  public List<Class<? extends Decoder>> getDecoders() {
    return delegate.getDecoders();
  }

  @Override
  public Map<String, Object> getUserProperties() {
    return delegate.getUserProperties();
  }

  @Scheduled(fixedRate = 20_000)
  public void ping() {
    WebsocketEndpoint.sendPingsToAll();
  }

  @Bean
  ApplicationListener<ContextClosedEvent> cleanUp() {
    return ignored -> WebsocketEndpoint.closeAllConnections();
  }
}
