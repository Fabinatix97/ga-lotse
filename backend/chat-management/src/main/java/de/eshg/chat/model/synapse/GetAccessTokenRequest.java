/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GetAccessTokenRequest {

  @JsonProperty("type")
  private String type;

  @JsonProperty("user")
  private String user;

  @JsonProperty("password")
  private String password;

  @JsonProperty("refresh_token")
  private boolean refreshToken;

  public String getType() {
    return type;
  }

  public GetAccessTokenRequest type(String type) {
    this.type = type;
    return this;
  }

  public String getUser() {
    return user;
  }

  public GetAccessTokenRequest user(String user) {
    this.user = user;
    return this;
  }

  public String getPassword() {
    return password;
  }

  public GetAccessTokenRequest password(String password) {
    this.password = password;
    return this;
  }

  public boolean isRefreshToken() {
    return refreshToken;
  }

  public GetAccessTokenRequest refreshToken(boolean refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}
