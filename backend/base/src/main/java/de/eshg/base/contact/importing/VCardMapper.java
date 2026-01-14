/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.importing;

import de.eshg.base.GenderDto;
import de.eshg.base.contact.api.VCardAddressDto;
import de.eshg.base.contact.api.VCardInstitutionContactDto;
import de.eshg.base.contact.api.VCardPersonContactDto;
import ezvcard.VCard;
import ezvcard.property.*;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VCardMapper {

  private static final Pattern HOUSE_NUMBER_PATTERN = Pattern.compile("\\s\\d.*$");

  private VCardMapper() {}

  public static VCardPersonContactDto mapVCardFromPersonToApi(VCard vCard) {
    return new VCardPersonContactDto(
        mapTitlesFromVCard(vCard.getStructuredName()),
        mapGenderFromVCard(vCard.getGender()),
        mapFullNameFromVCard(vCard.getFormattedName()),
        mapFirstNameFromVCard(vCard.getStructuredName()),
        mapLastNameFromVCard(vCard.getStructuredName()),
        mapPhoneNumbersFromVCard(vCard.getTelephoneNumbers()),
        mapEMailAddressesFromVCard(vCard.getEmails()),
        extractAddressesFromVCard(vCard.getAddresses()));
  }

  public static VCardInstitutionContactDto mapVCardFromInstitutionToApi(VCard vCard) {
    return new VCardInstitutionContactDto(
        mapFullNameFromVCard(vCard.getFormattedName()),
        mapPhoneNumbersFromVCard(vCard.getTelephoneNumbers()),
        mapEMailAddressesFromVCard(vCard.getEmails()),
        extractAddressesFromVCard(vCard.getAddresses()));
  }

  private static List<String> mapTitlesFromVCard(StructuredName structuredName) {
    if (structuredName == null) {
      return Collections.emptyList();
    }
    return structuredName.getPrefixes();
  }

  private static GenderDto mapGenderFromVCard(Gender gender) {
    if (gender == null) {
      return GenderDto.NOT_SPECIFIED;
    }
    return switch (gender.getGender()) {
      case Gender.MALE -> GenderDto.MALE;
      case Gender.FEMALE -> GenderDto.FEMALE;
      case Gender.OTHER -> GenderDto.DIVERSE;
      default -> GenderDto.NOT_SPECIFIED;
    };
  }

  private static String mapFullNameFromVCard(FormattedName formattedName) {
    if (formattedName == null) {
      return "";
    }
    return formattedName.getValue().strip();
  }

  private static String mapFirstNameFromVCard(StructuredName structuredName) {
    if (structuredName == null || structuredName.getGiven() == null) {
      return "";
    }
    return structuredName.getGiven().strip();
  }

  private static String mapLastNameFromVCard(StructuredName structuredName) {
    if (structuredName == null || structuredName.getFamily() == null) {
      return "";
    }

    return structuredName.getFamily().strip();
  }

  private static List<String> mapPhoneNumbersFromVCard(List<Telephone> telephoneNumbers) {
    return telephoneNumbers.stream()
        .map(t -> returnPropertyOrBlankStringIfNull(t.getText()))
        .filter(t -> !t.isEmpty())
        .toList();
  }

  private static List<String> mapEMailAddressesFromVCard(List<Email> emails) {
    return emails.stream()
        .map(t -> returnPropertyOrBlankStringIfNull(t.getValue()))
        .filter(t -> !t.isEmpty())
        .toList();
  }

  private static List<VCardAddressDto> extractAddressesFromVCard(List<Address> addresses) {
    return addresses.stream().map(VCardMapper::extractAddressFromAttribute).toList();
  }

  private static VCardAddressDto extractAddressFromAttribute(Address attribute) {
    return new VCardAddressDto(
        returnPropertyOrBlankStringIfNull(attribute.getCountry()),
        returnPropertyOrBlankStringIfNull(attribute.getLocality()),
        returnPropertyOrBlankStringIfNull(attribute.getPostalCode()),
        extractStreetNameFromStreetProperty(attribute.getStreetAddress()),
        extractHouseNumberFromStreetProperty(attribute.getStreetAddress()),
        returnPropertyOrBlankStringIfNull(attribute.getExtendedAddress()),
        returnPropertyOrBlankStringIfNull(attribute.getPoBox()));
  }

  private static String returnPropertyOrBlankStringIfNull(String property) {
    if (property == null) {
      return "";
    }
    return property.strip();
  }

  protected static String extractHouseNumberFromStreetProperty(String streetComponent) {
    String rawHouseNumber = extractRawHouseNumber(streetComponent);

    if (rawHouseNumber == null) {
      return "";
    }

    return rawHouseNumber.strip();
  }

  protected static String extractStreetNameFromStreetProperty(String streetComponent) {
    String rawHouseNumber = extractRawHouseNumber(streetComponent);

    if (rawHouseNumber == null) {
      return "";
    }

    if (rawHouseNumber.isEmpty()) {
      return streetComponent.strip();
    }

    return streetComponent.substring(0, streetComponent.indexOf(rawHouseNumber)).strip();
  }

  private static String extractRawHouseNumber(String streetComponent) {
    if (streetComponent == null) {
      return null;
    }

    Matcher matcher = HOUSE_NUMBER_PATTERN.matcher(streetComponent);
    if (matcher.find()) {
      return matcher.group(0);
    }

    return "";
  }
}
