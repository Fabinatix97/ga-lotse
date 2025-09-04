/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;
import java.util.Map;

public enum LsdTestUser implements KeycloakUser {
  DUMMY("dummy"),
  INSPECTION("inspection"),
  BASE("base"),
  SCHOOL_ENTRY("school-entry");

  private final String username;
  private final String password;

  LsdTestUser(String username) {
    this.username = username;
    this.password =
        String.format("password-for-%-19s", username.replaceAll("[^a-zA-Z0-9]", ""))
            .replaceAll(" ", "-");
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return null;
  }

  @Override
  public String phoneNumber() {
    return null;
  }

  @Override
  public String externalChatUsername() {
    return null;
  }

  @Override
  public String password() {
    return password;
  }

  public UsernamePassword getUsernamePassword() {
    return new UsernamePassword(username, password, Realm.CITIZENS);
  }

  @Override
  public String firstName() {
    return null;
  }

  @Override
  public String lastName() {
    return null;
  }

  @Override
  public List<KeycloakRole> roles() {
    return List.of();
  }

  @Override
  public List<KeycloakGroup> groups() {
    return List.of();
  }

  @Override
  public Map<String, String> additionalAttributes() {
    return Map.of();
  }
}
