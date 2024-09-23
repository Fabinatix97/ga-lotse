/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

public interface KeycloakUserAttribute {
  String DEFAULT_ATTRIBUTE_FIRST_NAME = "firstName";
  String DEFAULT_ATTRIBUTE_LAST_NAME = "lastName";
  String DEFAULT_ATTRIBUTE_EMAIL = "email";

  String KEYCLOAK_VALUE_REF_TEMPLATE = "${%s}";

  String getKey();

  String getDisplayName();

  Group getGroup();

  boolean isRequired();

  enum Group {
    DEFAULT,
    CUSTOM,
  }
}
