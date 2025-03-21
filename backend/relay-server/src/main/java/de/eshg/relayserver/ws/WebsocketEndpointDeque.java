/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver.ws;

import java.io.Serial;
import java.util.concurrent.ConcurrentLinkedDeque;

public class WebsocketEndpointDeque extends ConcurrentLinkedDeque<WebsocketEndpoint> {
  @Serial private static final long serialVersionUID = 1L;

  public boolean addEndpoint(WebsocketEndpoint endpoint) {
    synchronized (this) {
      if (this.contains(endpoint)) {
        return false;
      }
      return this.add(endpoint);
    }
  }

  public WebsocketEndpoint rotateAndGet() {
    // for round-robin load-balancing
    synchronized (this) {
      WebsocketEndpoint endpoint = this.poll();
      if (endpoint != null) {
        this.add(endpoint);
      }
      return endpoint;
    }
  }
}
