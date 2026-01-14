/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CitizenUserAttributesMapper {

  protected static final Logger log = LoggerFactory.getLogger(CitizenUserAttributesMapper.class);
  public static final String ELLIPSIS = "[\u2026]"; // (three dots character)

  protected static String extractAttributeAndShortenIfLong(
      Map<String, List<String>> userAttributes,
      CitizenUserAttribute citizenUserAttribute,
      int maxLength) {
    String extractedAttribute = extractAttribute(userAttributes, citizenUserAttribute);

    String shortenedAttribute =
        shortenExtractedAttribute(citizenUserAttribute, maxLength, extractedAttribute);

    return shortenedAttribute;
  }

  protected static String shortenExtractedAttribute(
      CitizenUserAttribute citizenUserAttribute, int maxLength, String attribute) {
    String attributeShortened = StringUtils.abbreviate(attribute, ELLIPSIS, maxLength);

    if (!StringUtils.equals(attribute, attributeShortened)) {
      log.debug(
          "User attribute \"{}\" with value \"{}\" has been truncated to \"{}\" due to length restrictions",
          citizenUserAttribute,
          attribute,
          attributeShortened);
    }

    return attributeShortened;
  }

  protected static String extractAttribute(
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

  protected static CountryCode mapCountryCode(String countryCodeAttribute) {
    if (countryCodeAttribute == null || countryCodeAttribute.isEmpty()) {
      return CountryCode.UNKNOWN;
    }

    try {
      return CountryCode.valueOf(countryCodeAttribute.toUpperCase());
    } catch (IllegalArgumentException e) {
      log.debug(
          "Could not map country code provided by \"{}\", proceeding with a null value",
          countryCodeAttribute,
          e);
      return CountryCode.UNKNOWN;
    }
  }
}
