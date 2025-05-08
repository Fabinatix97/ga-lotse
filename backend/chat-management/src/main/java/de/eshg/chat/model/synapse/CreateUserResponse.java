/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateUserResponse {

  @JsonProperty("user_id")
  private String userId;

  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("home_server")
  private String homeServer;

  @JsonProperty("device_id")
  private String deviceId;

  public String getUserId() {
    return userId;
  }

  public CreateUserResponse userId(String userId) {
    this.userId = userId;
    return this;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public CreateUserResponse accessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public String getHomeServer() {
    return homeServer;
  }

  public CreateUserResponse homeServer(String homeServer) {
    this.homeServer = homeServer;
    return this;
  }

  public String getDeviceId() {
    return deviceId;
  }

  public CreateUserResponse deviceId(String deviceId) {
    this.deviceId = deviceId;
    return this;
  }
}
