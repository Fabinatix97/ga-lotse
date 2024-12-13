/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;

public enum IdpTestUser implements KeycloakUser {
  MUK_DUMMY("muk-dummy", "password"),
  BUND_ID_DUMMY("bund-id-dummy", "password"),
  ;

  private final String username;
  private final String password;

  IdpTestUser(String username, String password) {
    this.username = username;
    this.password = password;
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return username + KeycloakUser.TEST_USER_EMAIL_POSTFIX;
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
  public String firstName() {
    return null;
  }

  @Override
  public String lastName() {
    return null;
  }

  @Override
  public String password() {
    return password;
  }

  @Override
  public List<KeycloakRole> roles() {
    return List.of();
  }

  @Override
  public List<KeycloakGroup> groups() {
    return List.of();
  }
}
