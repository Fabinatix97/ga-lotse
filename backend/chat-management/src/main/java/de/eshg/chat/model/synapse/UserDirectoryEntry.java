/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDirectoryEntry {

  @JsonProperty("user_id")
  private String userId;

  @JsonProperty("display_name")
  private String displayName;

  @JsonProperty("avatar_url")
  private String avatarUrl;

  public String getUserId() {
    return userId;
  }

  public UserDirectoryEntry userId(String userId) {
    this.userId = userId;
    return this;
  }

  public String getDisplayName() {
    return displayName;
  }

  public UserDirectoryEntry displayName(String displayName) {
    this.displayName = displayName;
    return this;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public UserDirectoryEntry avatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
    return this;
  }
}
