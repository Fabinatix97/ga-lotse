/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RefreshTokenResponse {

  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("expires_in_ms")
  private Long expiresInMs;

  @JsonProperty("refresh_token")
  private String refreshToken;

  public String getAccessToken() {
    return accessToken;
  }

  public RefreshTokenResponse accessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public Long getExpiresInMs() {
    return expiresInMs;
  }

  public RefreshTokenResponse expiresInMs(Long expiresInMs) {
    this.expiresInMs = expiresInMs;
    return this;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public RefreshTokenResponse refreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}
