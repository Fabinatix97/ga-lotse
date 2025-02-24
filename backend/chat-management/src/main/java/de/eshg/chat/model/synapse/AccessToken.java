/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import java.time.Instant;

public class AccessToken {

  private String accessToken;
  private String refreshToken;
  private Instant tokenExpirationTime;

  public String getAccessToken() {
    return accessToken;
  }

  public AccessToken accessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public AccessToken refreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }

  public Instant getTokenExpirationTime() {
    return tokenExpirationTime;
  }

  public AccessToken tokenExpirationTime(Instant tokenExpirationTime) {
    this.tokenExpirationTime = tokenExpirationTime;
    return this;
  }
}
