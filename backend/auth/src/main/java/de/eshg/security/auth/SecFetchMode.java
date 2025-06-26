/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

/**
 * See <a
 * href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode">https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode</a>
 */
public enum SecFetchMode {
  /** The request is a CORS protocol request. */
  CORS("cors"),

  /** The request is initiated by navigation between HTML documents. */
  NAVIGATE("navigate"),

  /** The request is a no-cors request (see Request.mode). */
  NO_CORS("no-cors"),

  /** The request is made from the same origin as the resource that is being requested. */
  SAME_ORIGIN("same-origin"),

  /** The request is being made to establish a WebSocket connection. */
  WEBSOCKET("websocket"),
  ;

  private final String value;

  SecFetchMode(String value) {
    this.value = value;
  }

  String getValue() {
    return value;
  }
}
