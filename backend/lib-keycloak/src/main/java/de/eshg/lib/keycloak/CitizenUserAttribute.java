/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import static de.eshg.lib.keycloak.UserAttributePermissions.ADMIN_ONLY;
import static de.eshg.lib.keycloak.UserAttributePermissions.ADMIN_READ_ONLY;

import java.util.List;

public enum CitizenUserAttribute implements KeycloakUserAttribute {
  USERNAME(
      DEFAULT_ATTRIBUTE_USERNAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_USERNAME),
      false,
      Group.DEFAULT,
      DEFAULT_USERNAME_VALIDATIONS),
  EMAIL(
      DEFAULT_ATTRIBUTE_EMAIL,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_EMAIL),
      false,
      Group.DEFAULT,
      DEFAULT_EMAIL_VALIDATIONS),
  FIRST_NAME(
      DEFAULT_ATTRIBUTE_FIRST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_FIRST_NAME),
      false,
      Group.DEFAULT,
      DEFAULT_NAME_VALIDATIONS),
  LAST_NAME(
      DEFAULT_ATTRIBUTE_LAST_NAME,
      KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_LAST_NAME),
      false,
      Group.DEFAULT,
      DEFAULT_NAME_VALIDATIONS),
  // Keep key in sync with de.eshg.keycloak.api.user.KeycloakAttributes.ACCESS_CODE_ATTRIBUTE
  ACCESS_CODE("access_code", "Zugangscode", ADMIN_ONLY),
  // Keep key in sync with de.eshg.keycloak.api.user.KeycloakAttributes.DATE_OF_BIRTH_ATTRIBUTE
  DATE_OF_BIRTH("date_of_birth", "Geburtsdatum", ADMIN_ONLY),
  MUK_DATA_TRANSMITTER_PSEUDONYM_ID(
      "muk.dataTransmitterPseudonymId", "Datenübermittlerpseudonymid"),
  MUK_FACILITY_NAME("muk.facilityName", "Firmenname"),
  MUK_ADDRESS_STREET("muk.address.street", "Unternehmensanschrift - Strasse"),
  MUK_ADDRESS_HOUSE_NUMBER("muk.address.houseNumber", "Unternehmensanschrift - Hausnummer"),
  MUK_ADDRESS_ADDRESS_ADDITION("muk.address.addition", "Unternehmensanschrift - Adressergänzung"),
  MUK_ADDRESS_POSTAL_CODE("muk.address.postalCode", "Unternehmensanschrift - PLZ"),
  MUK_ADDRESS_CITY("muk.address.city", "Unternehmensanschrift - Ort"),
  MUK_ADDRESS_COUNTRY("muk.address.country", "Unternehmensanschrift - Land"),
  MUK_ADDRESS_TYPE("muk.address.type", "Unternehmensanschrift - Typ"),
  BUND_ID_B_PK_2("bund-id.bPK2", "bPK2"),
  BUND_ID_POSTAL_ADDRESS("bund-id.postalAddress", "Privatadresse - Strasse"),
  BUND_ID_POSTAL_CODE("bund-id.postalCode", "Privatadresse - PLZ"),
  BUND_ID_LOCALITY_NAME("bund-id.localityName", "Privatadresse - Ort"),
  BUND_ID_COUNTRY("bund-id.country", "Privatadresse - Land"),
  BUND_ID_PERSONAL_TITLE("bund-id.personalTitle", "Titel"),
  BUND_ID_GENDER("bund-id.gender", "Anrede"),
  BUND_ID_BIRTH_DATE("bund-id.birthDate", "Geburtsdatum"),
  BUND_ID_PLACE_OF_BIRTH("bund-id.placeOfBirth", "Geburtsort"),
  BUND_ID_BIRTH_NAME("bund-id.birthName", "Geburtsname"),
  BUND_ID_TELEPHONE_NUMBER("bund-id.telephoneNumber", "Telefonnummer");

  private final String key;
  private final String displayName;
  private final boolean required;
  private final Group group;
  private final UserAttributePermissions permissions;
  private final List<ValidationRule> validationRules;

  CitizenUserAttribute(String key, String displayName, ValidationRule... validationRules) {
    this(key, displayName, ADMIN_READ_ONLY, validationRules);
  }

  CitizenUserAttribute(
      String key,
      String displayName,
      UserAttributePermissions permissions,
      ValidationRule... validationRules) {
    this(key, displayName, false, Group.CUSTOM, permissions, validationRules);
  }

  CitizenUserAttribute(
      String key,
      String displayName,
      boolean required,
      Group group,
      ValidationRule... validationRules) {
    this(key, displayName, required, group, ADMIN_READ_ONLY, validationRules);
  }

  CitizenUserAttribute(
      String key,
      String displayName,
      boolean required,
      Group group,
      UserAttributePermissions permissions,
      ValidationRule... validationRules) {
    this.key = key;
    this.displayName = displayName;
    this.required = required;
    this.group = group;
    this.permissions = permissions;
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
  public UserAttributePermissions getPermissions() {
    return permissions;
  }

  @Override
  public List<ValidationRule> getValidationRules() {
    return validationRules;
  }
}
