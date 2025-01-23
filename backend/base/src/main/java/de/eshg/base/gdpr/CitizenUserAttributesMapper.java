/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CitizenUserAttributesMapper {

  protected static final Logger log = LoggerFactory.getLogger(CitizenUserAttributesMapper.class);

  protected static String extractAttributeAndShortenIfLong(
      Map<String, List<String>> userAttributes,
      CitizenUserAttribute citizenUserAttribute,
      int maxLength) {
    String extracted = extractAttribute(userAttributes, citizenUserAttribute);

    String truncated = shortenExtracted(citizenUserAttribute, maxLength, extracted);
    if (truncated != null) return truncated;

    return extracted;
  }

  protected static String shortenExtracted(
      CitizenUserAttribute citizenUserAttribute, int maxLength, String extracted) {
    String ellipsis = "[...]";

    if (extracted != null && extracted.length() > maxLength) {
      String truncated = extracted.substring(0, maxLength - ellipsis.length()) + ellipsis;
      log.debug(
          "User attribute \"{}\" with value \"{}\" has been truncated to \"{}\" due to length restrictions",
          citizenUserAttribute,
          extracted,
          truncated);
      return truncated;
    }
    return extracted;
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
