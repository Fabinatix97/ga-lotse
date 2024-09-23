/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

public enum EmployeeUserAttribute implements KeycloakUserAttribute {
  EMAIL(
      DEFAULT_ATTRIBUTE_EMAIL,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_EMAIL),
      true,
      Group.DEFAULT),
  FIRST_NAME(
      DEFAULT_ATTRIBUTE_FIRST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_FIRST_NAME),
      true,
      Group.DEFAULT),
  LAST_NAME(
      DEFAULT_ATTRIBUTE_LAST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_LAST_NAME),
      true,
      Group.DEFAULT),
  PHONE_NUMBER("eshg.phone_number", "Telefon"),
  EXTERNAL_CHAT_USERNAME("eshg.external_chat_username", "Chatname"),
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

  EmployeeUserAttribute(String key, String displayName) {
    this(key, displayName, false, Group.CUSTOM);
  }

  EmployeeUserAttribute(String key, String displayName, boolean required, Group group) {
    this.key = key;
    this.displayName = displayName;
    this.required = required;
    this.group = group;
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
}
