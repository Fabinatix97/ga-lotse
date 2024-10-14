/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.ArrayList;
import java.util.List;

public enum CitizenTestUser implements KeycloakUser {
  CITIZEN("citizen", "+49 555 123 100", "password", "Max", "Mustermann", List.of());

  private final String username;
  private final String email;
  private final String phoneNumber;
  private final String password;
  private final String firstName;
  private final String lastName;
  private final List<KeycloakRole> roles;

  CitizenTestUser(
      String username,
      String phoneNumber,
      String password,
      String firstName,
      String lastName,
      List<CitizenPermissionRole> roles) {
    this.username = username;
    this.email = username + TEST_USER_EMAIL_POSTFIX;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = new ArrayList<>(roles);
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return email;
  }

  @Override
  public String phoneNumber() {
    return phoneNumber;
  }

  @Override
  public String externalChatUsername() {
    return username;
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
    return firstName;
  }

  @Override
  public String lastName() {
    return lastName;
  }

  @Override
  public List<KeycloakRole> roles() {
    return roles;
  }

  @Override
  public List<KeycloakGroup> groups() {
    return List.of();
  }
}
