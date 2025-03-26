/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver.ws;

import java.io.Serial;
import java.util.concurrent.ConcurrentLinkedDeque;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebsocketEndpointDeque extends ConcurrentLinkedDeque<WebsocketEndpoint> {
  @Serial private static final long serialVersionUID = 1L;
  private final transient Logger logger;

  public WebsocketEndpointDeque(String name) {
    logger = LoggerFactory.getLogger(WebsocketEndpointDeque.class.getSimpleName() + ":" + name);
    logger.debug("creating endpoint deque");
  }

  public boolean addEndpoint(WebsocketEndpoint endpoint) {
    synchronized (this) {
      if (this.contains(endpoint)) {
        logger.debug("endpoint {} already in deque", endpoint);
        return false;
      }
      logger.debug("adding endpoint {} to deque", endpoint);
      logger.debug("before add: {}", this);
      this.add(endpoint);
      logger.debug("after add: {}", this);
      return true;
    }
  }

  public WebsocketEndpoint rotateAndGet() {
    // for round-robin load-balancing
    synchronized (this) {
      logger.debug("before rotate: {}", this);
      WebsocketEndpoint endpoint = this.pollFirst();
      if (endpoint != null) {
        this.add(endpoint);
      }
      logger.debug("after rotate: {}", this);
      logger.debug("returning endpoint {}", endpoint);
      return endpoint;
    }
  }
}
