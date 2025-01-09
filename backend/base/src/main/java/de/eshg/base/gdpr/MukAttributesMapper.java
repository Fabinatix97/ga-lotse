/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.gdpr.persistence.GdprFacility;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MukAttributesMapper {

  private static final String DEFAULT_FOREIGN_POSTAL_CODE = "00000";

  private static final Logger log = LoggerFactory.getLogger(MukAttributesMapper.class);

  private MukAttributesMapper() {
    throw new IllegalStateException("Utility class");
  }

  protected static GdprFacility mapToDm(FacilityIdentificationDataForValidation dataDto) {
    GdprFacility data = new GdprFacility();
    data.setName(dataDto.facilityName());
    data.setContactAddress(GdprProcedureMapper.mapToDmGdprFacilityAddress(dataDto.addressDto()));

    return data;
  }

  protected static FacilityIdentificationDataForValidation mapFromKeycloak(
      Map<String, List<String>> userAttributes) {
    CountryCode countryCode =
        mapCountryCode(extractAttribute(userAttributes, CitizenUserAttribute.MUK_ADDRESS_COUNTRY));
    String city =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.MUK_ADDRESS_CITY,
            DomesticAddressDto.MAX_CITY_LENGTH);
    String postalCode =
        mapPostalCode(
            extractAttribute(userAttributes, CitizenUserAttribute.MUK_ADDRESS_POSTAL_CODE),
            countryCode);
    String street =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.MUK_ADDRESS_STREET,
            DomesticAddressDto.MAX_STREET_LENGTH);
    String houseNumber =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.MUK_ADDRESS_HOUSE_NUMBER,
            DomesticAddressDto.MAX_HOUSE_NUMBER_LENGTH);
    String addressAddition =
        extractAttribute(userAttributes, CitizenUserAttribute.MUK_ADDRESS_ADDRESS_ADDITION);

    DomesticAddressDto addressDto =
        new DomesticAddressDto(
            countryCode, city, postalCode, null, street, houseNumber, addressAddition);

    return new FacilityIdentificationDataForValidation(
        extractAttribute(userAttributes, CitizenUserAttribute.MUK_FACILITY_NAME), addressDto);
  }

  private static String extractAttributeAndShortenIfLong(
      Map<String, List<String>> userAttributes,
      CitizenUserAttribute citizenUserAttribute,
      int maxLength) {
    String ellipsis = "[...]";
    String extracted = extractAttribute(userAttributes, citizenUserAttribute);

    if (extracted != null && extracted.length() > maxLength) {
      String truncated = extracted.substring(0, maxLength - ellipsis.length()) + ellipsis;
      log.debug(
          "MUK user attribute \"{}\" with value \"{}\" has been truncated to \"{}\" due to length restrictions",
          citizenUserAttribute,
          extracted,
          truncated);
      return truncated;
    }

    return extracted;
  }

  private static String extractAttribute(
      Map<String, List<String>> userAttributes, CitizenUserAttribute citizenUserAttribute) {
    if (userAttributes == null) {
      return null;
    }

    List<String> list = userAttributes.get(citizenUserAttribute.getKey());
    if (list == null || list.isEmpty()) {
      return null;
    }

    return list.getFirst();
  }

  private static String mapPostalCode(String postalCode, CountryCode countryCode) {
    if (postalCode != null || countryCode == CountryCode.DE) {
      return postalCode;
    }

    return DEFAULT_FOREIGN_POSTAL_CODE;
  }

  private static CountryCode mapCountryCode(String countryCodeAttribute) {
    if (countryCodeAttribute == null || countryCodeAttribute.isEmpty()) {
      return null;
    }

    try {
      return CountryCode.valueOf(countryCodeAttribute.toUpperCase());
    } catch (IllegalArgumentException e) {
      log.debug(
          "Could not map country code provided by \"{}\", proceeding with a null value",
          countryCodeAttribute,
          e);
      return null;
    }
  }
}
