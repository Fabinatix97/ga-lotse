/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import de.eshg.base.SalutationDto;
import java.util.Arrays;
import java.util.List;

public enum EmployeeUserAttribute implements KeycloakUserAttribute {
  USERNAME(
      DEFAULT_ATTRIBUTE_USERNAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_USERNAME),
      false,
      Group.DEFAULT,
      DEFAULT_USERNAME_VALIDATIONS),
  EMAIL(
      DEFAULT_ATTRIBUTE_EMAIL,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_EMAIL),
      true,
      Group.DEFAULT,
      DEFAULT_EMAIL_VALIDATIONS),
  FIRST_NAME(
      DEFAULT_ATTRIBUTE_FIRST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_FIRST_NAME),
      true,
      Group.DEFAULT,
      DEFAULT_NAME_VALIDATIONS),
  LAST_NAME(
      DEFAULT_ATTRIBUTE_LAST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_LAST_NAME),
      true,
      Group.DEFAULT,
      DEFAULT_NAME_VALIDATIONS),
  TITLE(
      "eshg.title",
      "Titel",
      new ValidationRule.Length(1, 119),
      new ValidationRule.Pattern("\\p{ASCII}+")),
  SALUTATION(
      "eshg.salutation",
      "Anrede",
      new ValidationRule.Length(1, 255),
      new ValidationRule.Pattern(
          String.join(
              "|", Arrays.stream(SalutationDto.values()).map(Enum::name).toArray(String[]::new)))),
  PHONE_NUMBER(
      "eshg.phone_number",
      "Telefon",
      new ValidationRule.Length(1, 23),
      new ValidationRule.Pattern("[-+0-9() ]+")),
  EXTERNAL_CHAT_USERNAME(
      "eshg.external_chat_username",
      "Chatname",
      new ValidationRule.Length(3, 255),
      new ValidationRule.Pattern("\\p{ASCII}+")),
  SUGGESTED_BY("eshg.suggested_by", "Vorgeschlagen von"),
  AUDIT_LOG_ENCRYPTED_PRIVATE_KEY(
      "eshg.audit_log.encrypted_private_key", "Audit Log - Privater Schlüssel (verschlüsselt)"),
  AUDIT_LOG_PUBLIC_KEY("eshg.audit_log.public_key", "Audit Log - Öffentlicher Schlüssel"),
  AUDIT_LOG_CRYPTO_VERSION("eshg.audit_log.crypto_version", "Audit Log - Kryptographieversion"),
  AUDIT_LOG_KEY_IDENTIFIER("eshg.audit_log.key_identifier", "Audit Log - Schlüssel ID");

  private final String key;
  private final String displayName;
  private final boolean required;
  private final Group group;
  private final List<ValidationRule> validationRules;

  EmployeeUserAttribute(String key, String displayName, ValidationRule... validationRules) {
    this(key, displayName, false, Group.CUSTOM, validationRules);
  }

  EmployeeUserAttribute(
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
  public List<ValidationRule> getValidationRules() {
    return validationRules;
  }
}
