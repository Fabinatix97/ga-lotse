/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import de.eshg.lib.keycloak.KeycloakGroup;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lib.keycloak.KeycloakUser;
import java.util.List;

public record KeycloakTestUser(
    String username,
    String phoneNumber,
    String externalChatUsername,
    String firstName,
    String lastName,
    String password,
    List<KeycloakRole> roles,
    List<KeycloakGroup> groups)
    implements KeycloakUser {

  public KeycloakTestUser(
      String username,
      String phoneNumber,
      String externalChatUsername,
      String firstName,
      String lastName,
      String password,
      KeycloakRole role,
      List<KeycloakGroup> group) {
    this(
        username,
        phoneNumber,
        externalChatUsername,
        firstName,
        lastName,
        password,
        List.of(role),
        group);
  }

  public KeycloakTestUser(
      String username,
      String phoneNumber,
      String externalChatUsername,
      String firstName,
      String lastName,
      String password,
      KeycloakRole role) {
    this(
        username,
        phoneNumber,
        externalChatUsername,
        firstName,
        lastName,
        password,
        List.of(role),
        List.of());
  }

  @Override
  public String email() {
    return username + TEST_USER_EMAIL_POSTFIX;
  }
}
