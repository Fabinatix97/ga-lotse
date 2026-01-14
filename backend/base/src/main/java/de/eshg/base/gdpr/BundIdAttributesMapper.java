/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.gdpr.CitizenUserAttributesMapper.*;

import de.eshg.base.SalutationDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.persistence.entity.BirthDetails;
import de.eshg.base.gdpr.api.GdprPersonDto;
import de.eshg.base.gdpr.persistence.GdprPerson;
import de.eshg.base.util.MappingUtil;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.representations.idm.UserRepresentation;

public class BundIdAttributesMapper {

  public static final String ELLIPSIS_HOUSE_NUMBER = "[\u2026]"; // (three dots character)

  private BundIdAttributesMapper() {
    throw new IllegalStateException("Utility class");
  }

  protected static GdprPerson mapToDm(PersonIdentificationDataForValidation dataDto) {
    GdprPerson data = new GdprPerson();
    data.setFirstName(dataDto.firstName());
    data.setLastName(dataDto.lastName());
    data.setBirthDetails(
        mapToDm(dataDto.birthDate(), dataDto.nameAtBirth(), dataDto.placeOfBirth()));
    data.setEmailAddress(dataDto.emailAddress());
    data.setPhoneNumber(dataDto.phoneNumber());
    data.setTitle(dataDto.title());
    data.setSalutation(MappingUtil.mapSalutationToDm(dataDto.salutationDto()));
    data.setContactAddress(GdprProcedureMapper.mapToDmGdprPersonAddress(dataDto.addressDto()));
    data.setBpk2(dataDto.bpk2());

    return data;
  }

  private static BirthDetails mapToDm(String dateOfBirth, String nameAtBirth, String placeOfBirth) {
    if (dateOfBirth == null) {
      return new BirthDetails(null, nameAtBirth, placeOfBirth, null);
    }

    LocalDate dateOfBirthParsed =
        LocalDate.parse(dateOfBirth, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    return new BirthDetails(dateOfBirthParsed, nameAtBirth, placeOfBirth, null);
  }

  protected static PersonIdentificationDataForValidation mapFromKeycloak(
      UserRepresentation representation) {
    String firstName =
        shortenExtractedAttribute(
            CitizenUserAttribute.FIRST_NAME,
            GdprPersonDto.MAX_FIRST_NAME_LENGTH,
            representation.getFirstName());
    String lastName =
        shortenExtractedAttribute(
            CitizenUserAttribute.LAST_NAME,
            GdprPersonDto.MAX_LAST_NAME_LENGTH,
            representation.getLastName());

    Map<String, List<String>> userAttributes = representation.getAttributes();

    String bpk2 = extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_B_PK_2);
    String dateOfBirth = extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_BIRTH_DATE);
    String nameAtBirth = extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_BIRTH_NAME);
    String placeOfBirth =
        extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_PLACE_OF_BIRTH);

    String emailAddress = extractAttribute(userAttributes, CitizenUserAttribute.EMAIL);
    String phoneNumber =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.BUND_ID_TELEPHONE_NUMBER,
            GdprPersonDto.MAX_PHONE_NUMBER_LENGTH);
    String title =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.BUND_ID_PERSONAL_TITLE,
            GdprPersonDto.MAX_TITLE_LENGTH);
    String gender = extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_GENDER);
    SalutationDto salutationDto = mapGender(gender);

    return new PersonIdentificationDataForValidation(
        bpk2,
        firstName,
        lastName,
        dateOfBirth,
        nameAtBirth,
        placeOfBirth,
        emailAddress,
        phoneNumber,
        title,
        salutationDto,
        extractDomesticAddressDto(userAttributes));
  }

  public static DomesticAddressDto extractDomesticAddressDto(
      Map<String, List<String>> userAttributes) {
    CountryCode countryCode =
        mapCountryCode(extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_COUNTRY));
    String city =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.BUND_ID_LOCALITY_NAME,
            DomesticAddressDto.MAX_CITY_LENGTH);
    String postalCode =
        extractAttributeAndShortenIfLong(
            userAttributes,
            CitizenUserAttribute.BUND_ID_POSTAL_CODE,
            DomesticAddressDto.MAX_POSTAL_CODE_LENGTH);

    String bundIdPostalAddressAttribute =
        extractAttribute(userAttributes, CitizenUserAttribute.BUND_ID_POSTAL_ADDRESS);
    StreetAndHouseNumber streetAndHouseNumber =
        shortenIfLong(StreetAndHouseNumber.splitPostalAddress(bundIdPostalAddressAttribute));

    return new DomesticAddressDto(
        countryCode,
        city,
        postalCode,
        streetAndHouseNumber.street(),
        streetAndHouseNumber.houseNumber());
  }

  private static StreetAndHouseNumber shortenIfLong(StreetAndHouseNumber streetAndHouseNumber) {
    String street = streetAndHouseNumber.street();
    String streetShortened =
        StringUtils.abbreviate(street, ELLIPSIS, DomesticAddressDto.MAX_STREET_LENGTH);
    if (!StringUtils.equals(street, streetShortened)) {
      log.debug(
          "Extracted street part from User Attribute \"BUND_ID_POSTAL_ADDRESS\" (value \"{}\") has been truncated to {} due to length restrictions",
          street,
          streetShortened);
    }

    String houseNumber = streetAndHouseNumber.houseNumber();
    String houseNumberShortened =
        StringUtils.abbreviate(
            houseNumber, ELLIPSIS_HOUSE_NUMBER, DomesticAddressDto.MAX_HOUSE_NUMBER_LENGTH);
    if (!StringUtils.equals(houseNumber, houseNumberShortened)) {
      log.debug(
          "House number extracted from User Attribute \"BUND_ID_POSTAL_ADDRESS\" (value \"{}\") has been truncated to {} due to length restrictions",
          houseNumber,
          houseNumberShortened);
    }

    return new StreetAndHouseNumber(streetShortened, houseNumberShortened);
  }

  private static SalutationDto mapGender(String genderAttribute) {
    if (genderAttribute == null || genderAttribute.isEmpty()) {
      return SalutationDto.NOT_SPECIFIED;
    }

    try {
      return SalutationDto.valueOf(genderAttribute.toUpperCase());
    } catch (IllegalArgumentException e) {
      log.debug(
          "Could not map gender attribute provided by \"{}\" to salutation, proceeding with default value \"NOT_SPECIFIED\"",
          genderAttribute,
          e);
      return SalutationDto.NOT_SPECIFIED;
    }
  }
}
