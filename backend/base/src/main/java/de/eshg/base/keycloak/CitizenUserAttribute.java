/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import de.eshg.keycloak.api.user.KeycloakAttributes;
import java.util.List;

public enum CitizenUserAttribute implements KeycloakUserAttribute {
  EMAIL(
      DEFAULT_ATTRIBUTE_EMAIL,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_EMAIL),
      false,
      Group.DEFAULT),
  FIRST_NAME(
      DEFAULT_ATTRIBUTE_FIRST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_FIRST_NAME),
      false,
      Group.DEFAULT),
  LAST_NAME(
      DEFAULT_ATTRIBUTE_LAST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_LAST_NAME),
      false,
      Group.DEFAULT),
  ACCESS_CODE(KeycloakAttributes.ACCESS_CODE_ATTRIBUTE, "Zugangscode"),
  DATE_OF_BIRTH(KeycloakAttributes.DATE_OF_BIRTH_ATTRIBUTE, "Geburtsdatum");

  private final String key;
  private final String displayName;
  private final boolean required;
  private final Group group;
  private final List<ValidationRule> validationRules;

  CitizenUserAttribute(String key, String displayName, ValidationRule... validationRules) {
    this(key, displayName, false, Group.CUSTOM, validationRules);
  }

  CitizenUserAttribute(
      String key,
      String displayName,
      boolean required,
      Group group,
      ValidationRule... validationRules) {
    this.key = key;
    this.displayName = displayName;
    this.required = required;
    this.group = group;
    this.validationRules = List.of(validationRules);
  }

  @Override
  public String getKey() {
    return key;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }

  @Override
  public Group getGroup() {
    return group;
  }

  @Override
  public boolean isRequired() {
    return required;
  }

  @Override
  public List<ValidationRule> validationRules() {
    return validationRules;
  }
}
