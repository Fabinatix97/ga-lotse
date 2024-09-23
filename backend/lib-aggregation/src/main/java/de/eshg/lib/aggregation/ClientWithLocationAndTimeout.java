/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import java.time.Duration;

public class ClientWithLocationAndTimeout {
  private final String location;
  private final String url;
  private final Duration clientTimeout;

  public ClientWithLocationAndTimeout(String location, String url, Duration clientTimeout) {
    this.location = location;
    this.url = url;
    this.clientTimeout = clientTimeout;
  }

  public String getLocation() {
    return location;
  }

  public String getUrl() {
    return url;
  }

  public Duration getClientTimeout() {
    return clientTimeout;
  }
}
