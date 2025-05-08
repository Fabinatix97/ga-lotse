/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateUserRequest {
  @JsonProperty("username")
  private String username;

  @JsonProperty("displayname")
  private String displayname;

  @JsonProperty("password")
  private String password;

  @JsonProperty("nonce")
  private String nonce;

  @JsonProperty("admin")
  private Boolean admin;

  @JsonProperty("mac")
  private String mac;

  public String getUsername() {
    return username;
  }

  public CreateUserRequest username(String username) {
    this.username = username;
    return this;
  }

  public String getDisplayname() {
    return displayname;
  }

  public CreateUserRequest displayname(String displayname) {
    this.displayname = displayname;
    return this;
  }

  public String getPassword() {
    return password;
  }

  public CreateUserRequest password(String password) {
    this.password = password;
    return this;
  }

  public String getNonce() {
    return nonce;
  }

  public CreateUserRequest nonce(String nonce) {
    this.nonce = nonce;
    return this;
  }

  public Boolean getAdmin() {
    return admin;
  }

  public CreateUserRequest admin(Boolean admin) {
    this.admin = admin;
    return this;
  }

  public String getMac() {
    return mac;
  }

  public CreateUserRequest mac(String mac) {
    this.mac = mac;
    return this;
  }
}
