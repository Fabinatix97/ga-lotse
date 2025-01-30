/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.gdpr.CitizenUserAttributesMapper.extractAttribute;
import static de.eshg.base.gdpr.CitizenUserAttributesMapper.extractAttributeAndShortenIfLong;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.gdpr.persistence.GdprFacility;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import java.util.List;
import java.util.Map;
import org.keycloak.representations.idm.UserRepresentation;

public class MukAttributesMapper {

  private static final String DEFAULT_FOREIGN_POSTAL_CODE = "00000";

  private MukAttributesMapper() {
    throw new IllegalStateException("Utility class");
  }

  protected static GdprFacility mapToDm(FacilityIdentificationDataForValidation dataDto) {
    GdprFacility data = new GdprFacility();
    data.setName(dataDto.facilityName());
    data.setContactAddress(GdprProcedureMapper.mapToDmGdprFacilityAddress(dataDto.addressDto()));
    data.setDataTransmitterPseudonymId(dataDto.dataTransmitterPseudonymId());

    return data;
  }

  protected static FacilityIdentificationDataForValidation mapFromKeycloak(
      UserRepresentation representation) {
    Map<String, List<String>> userAttributes = representation.getAttributes();

    return new FacilityIdentificationDataForValidation(
        extractAttribute(userAttributes, CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID),
        extractAttribute(userAttributes, CitizenUserAttribute.MUK_FACILITY_NAME),
        extractDomesticAddressDto(userAttributes));
  }

  public static DomesticAddressDto extractDomesticAddressDto(
      Map<String, List<String>> userAttributes) {
    CountryCode countryCode =
        CitizenUserAttributesMapper.mapCountryCode(
            extractAttribute(userAttributes, CitizenUserAttribute.MUK_ADDRESS_COUNTRY));
    String city =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.MUK_ADDRESS_CITY,
            DomesticAddressDto.MAX_CITY_LENGTH);
    String postalCode =
        mapPostalCode(
            extractAttributeAndShortenIfLong(
                userAttributes,
                CitizenUserAttribute.MUK_ADDRESS_POSTAL_CODE,
                DomesticAddressDto.MAX_POSTAL_CODE_LENGTH),
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

    return new DomesticAddressDto(
        countryCode, city, postalCode, null, street, houseNumber, addressAddition);
  }

  private static String mapPostalCode(String postalCode, CountryCode countryCode) {
    if (postalCode != null || countryCode == CountryCode.DE) {
      return postalCode;
    }

    return DEFAULT_FOREIGN_POSTAL_CODE;
  }
}
