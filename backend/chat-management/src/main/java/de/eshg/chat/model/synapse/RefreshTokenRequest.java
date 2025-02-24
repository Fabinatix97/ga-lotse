/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RefreshTokenRequest {

  @JsonProperty("refresh_token")
  private String refreshToken;

  public String getRefreshToken() {
    return refreshToken;
  }

  public RefreshTokenRequest refreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}
