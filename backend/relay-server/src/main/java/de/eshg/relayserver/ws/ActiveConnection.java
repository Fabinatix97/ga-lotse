/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver.ws;

import java.util.concurrent.atomic.AtomicBoolean;

record ActiveConnection(WebsocketEndpoint client, WebsocketEndpoint server, AtomicBoolean closing) {

  public ActiveConnection(WebsocketEndpoint client, WebsocketEndpoint server) {
    this(client, server, new AtomicBoolean(false));
  }

  public WebsocketEndpoint getOther(WebsocketEndpoint endpoint) {
    if (client == endpoint) {
      return server;
    } else if (server == endpoint) {
      return client;
    } else {
      throw new RuntimeException(endpoint + " not part of " + this);
    }
  }

  public boolean has(WebsocketEndpoint endpoint) {
    return client == endpoint || server == endpoint;
  }
}
