/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public enum BundIdUserAttribute implements IdpUserAttribute {
  B_PK_2(CitizenUserAttribute.BUND_ID_B_PK_2, "urn:oid:1.3.6.1.4.1.25484.494450.3", "bPK2", true),
  GIVEN_NAME(CitizenUserAttribute.FIRST_NAME, "urn:oid:2.5.4.42", "givenName", true),
  SURNAME(CitizenUserAttribute.LAST_NAME, "urn:oid:2.5.4.4", "surname", true),
  MAIL(CitizenUserAttribute.EMAIL, "urn:oid:0.9.2342.19200300.100.1.3", "mail", false),
  POSTAL_ADDRESS(
      CitizenUserAttribute.BUND_ID_POSTAL_ADDRESS, "urn:oid:2.5.4.16", "postalAddress", false),
  POSTAL_CODE(CitizenUserAttribute.BUND_ID_POSTAL_CODE, "urn:oid:2.5.4.17", "postalCode", false),
  LOCALITY_NAME(
      CitizenUserAttribute.BUND_ID_LOCALITY_NAME, "urn:oid:2.5.4.7", "localityName", false),
  COUNTRY(
      CitizenUserAttribute.BUND_ID_COUNTRY, "urn:oid:1.2.40.0.10.2.1.1.225599", "country", false),
  PERSONAL_TITLE(
      CitizenUserAttribute.BUND_ID_PERSONAL_TITLE,
      "urn:oid:0.9.2342.19200300.100.1.40",
      "personalTitle",
      false),
  GENDER(CitizenUserAttribute.BUND_ID_GENDER, "urn:oid:1.3.6.1.4.1.33592.1.3.5", "gender", false),
  BIRTH_DATE(
      CitizenUserAttribute.BUND_ID_BIRTH_DATE, "urn:oid:1.2.40.0.10.2.1.1.55", "birthdate", true),
  PLACE_OF_BIRTH(
      CitizenUserAttribute.BUND_ID_PLACE_OF_BIRTH,
      "urn:oid:1.3.6.1.5.5.7.9.2",
      "placeOfBirth",
      false),
  BIRTH_NAME(
      CitizenUserAttribute.BUND_ID_BIRTH_NAME,
      "urn:oid:1.2.40.0.10.2.1.1.225566",
      "birthName",
      false),
  TELEPHONE_NUMBER(
      CitizenUserAttribute.BUND_ID_TELEPHONE_NUMBER, "urn:oid:2.5.4.20", "telephoneNumber", false);

  private final CitizenUserAttribute citizenUserAttribute;
  private final String oid;
  private final String friendlyName;
  private final boolean required;

  BundIdUserAttribute(
      CitizenUserAttribute citizenUserAttribute,
      String oid,
      String friendlyName,
      boolean required) {
    this.citizenUserAttribute = citizenUserAttribute;
    this.oid = oid;
    this.friendlyName = friendlyName;
    this.required = required;
  }

  @Override
  public CitizenUserAttribute getCitizenUserAttribute() {
    return citizenUserAttribute;
  }

  @Override
  public String getSamlName() {
    return oid;
  }

  @Override
  public AttributeNameFormat getAttributeNameFormat() {
    return AttributeNameFormat.URI;
  }

  public String getFriendlyName() {
    return friendlyName;
  }

  public boolean isRequired() {
    return required;
  }
}
