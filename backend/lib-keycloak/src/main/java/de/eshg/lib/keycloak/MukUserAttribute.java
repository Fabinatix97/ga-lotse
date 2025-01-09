/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public enum MukUserAttribute implements IdpUserAttribute {
  FACILITY_NAME(CitizenUserAttribute.MUK_FACILITY_NAME, "Firmenname"),
  DATA_TRANSMITTER_PSEUDONYM_ID(
      CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID, "DatenuebermittlerPseudonymId"),
  ADDRESS_STREET(CitizenUserAttribute.MUK_ADDRESS_STREET, new AddressAttribute("Strasse")),
  ADDRESS_HOUSE_NUMBER(
      CitizenUserAttribute.MUK_ADDRESS_HOUSE_NUMBER, new AddressAttribute("Hausnummer")),
  ADDRESS_POSTAL_CODE(CitizenUserAttribute.MUK_ADDRESS_POSTAL_CODE, new AddressAttribute("PLZ")),
  ADDRESS_CITY(CitizenUserAttribute.MUK_ADDRESS_CITY, new AddressAttribute("Ort")),
  ADDRESS_COUNTRY(CitizenUserAttribute.MUK_ADDRESS_COUNTRY, new AddressAttribute("Land")),
  ADDRESS_ADDRESS_ADDITION(
      CitizenUserAttribute.MUK_ADDRESS_ADDRESS_ADDITION, new AddressAttribute("Adressergaenzung")),
  ADDRESS_TYPE(CitizenUserAttribute.MUK_ADDRESS_TYPE, new AddressAttribute("Typ"));

  private final CitizenUserAttribute citizenUserAttribute;
  private final String samlName;
  private final String nestedSamlName;
  private final String xPath;

  MukUserAttribute(CitizenUserAttribute citizenUserAttribute, String samlName) {
    this(citizenUserAttribute, samlName, null, null);
  }

  MukUserAttribute(CitizenUserAttribute citizenUserAttribute, AddressAttribute addressAttribute) {
    this(
        citizenUserAttribute,
        "Unternehmensanschrift",
        addressAttribute.name(),
        addressAttribute.getXPath());
  }

  MukUserAttribute(
      CitizenUserAttribute citizenUserAttribute,
      String samlName,
      String nestedSamlName,
      String xPath) {
    this.citizenUserAttribute = citizenUserAttribute;
    this.samlName = samlName;
    this.nestedSamlName = nestedSamlName;
    this.xPath = xPath;
  }

  @Override
  public CitizenUserAttribute getCitizenUserAttribute() {
    return citizenUserAttribute;
  }

  @Override
  public String getSamlName() {
    return samlName;
  }

  @Override
  public AttributeNameFormat getAttributeNameFormat() {
    return AttributeNameFormat.BASIC;
  }

  public String getNestedSamlName() {
    return nestedSamlName;
  }

  public String getXPath() {
    return xPath;
  }

  private record AddressAttribute(String name) {

    public String getXPath() {
      return "/*/*[local-name()='" + name + "']";
    }
  }
}
