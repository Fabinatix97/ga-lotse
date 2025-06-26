/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

/**
 * See <a
 * href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site">https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site</a>
 */
public enum SecFetchSite {
  /**
   * The request initiator and the server hosting the resource have a different site (i.e., a
   * request by "potentially-evil.com" for a resource at "example.com").
   */
  CROSS_SITE("cross-site"),

  /**
   * The request initiator and the server hosting the resource have the same origin (same scheme,
   * host and port).
   */
  SAME_ORIGIN("same-origin"),

  /**
   * The request initiator and the server hosting the resource have the same site, including the
   * scheme.
   */
  SAME_SITE("same-site"),

  /**
   * This request is a user-originated operation. For example: entering a URL into the address bar,
   * opening a bookmark, or dragging-and-dropping a file into the browser window.
   */
  NONE("none"),
  ;

  private final String value;

  SecFetchSite(String value) {
    this.value = value;
  }

  String getValue() {
    return value;
  }
}
