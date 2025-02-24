/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GetAccessTokenResponse {

  @JsonProperty("user_id")
  private String userId;

  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("home_server")
  private String homeServer;

  @JsonProperty("device_id")
  private String deviceId;

  @JsonProperty("expires_in_ms")
  private Long expiresInMs;

  @JsonProperty("refresh_token")
  private String refreshToken;

  public String getUserId() {
    return userId;
  }

  public GetAccessTokenResponse userId(String userId) {
    this.userId = userId;
    return this;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public GetAccessTokenResponse accessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public String getHomeServer() {
    return homeServer;
  }

  public GetAccessTokenResponse homeServer(String homeServer) {
    this.homeServer = homeServer;
    return this;
  }

  public String getDeviceId() {
    return deviceId;
  }

  public GetAccessTokenResponse deviceId(String deviceId) {
    this.deviceId = deviceId;
    return this;
  }

  public Long getExpiresInMs() {
    return expiresInMs;
  }

  public GetAccessTokenResponse expiresInMs(Long expiresInMs) {
    this.expiresInMs = expiresInMs;
    return this;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public GetAccessTokenResponse refreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}
