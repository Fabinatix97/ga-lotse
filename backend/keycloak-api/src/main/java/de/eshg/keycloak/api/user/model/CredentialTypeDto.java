/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

public enum CredentialTypeDto {
  PIN("pin"),
  DATE_OF_BIRTH("date-of-birth");

  private final String name;

  CredentialTypeDto(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
