/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

public enum CredentialType {
  PIN("pin"),
  DOB("dob"),
  PASSWORD("password");

  private final String name;

  CredentialType(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
