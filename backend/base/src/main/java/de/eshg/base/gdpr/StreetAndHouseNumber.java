/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public record StreetAndHouseNumber(String street, String houseNumber) {

  private static final String STREET_PART_REGEX = "^(.*)\\s+";
  private static final String NUMBER_WITH_LETTER_REGEX = "\\d+\\s*[A-Za-z]{0,3}";

  private static String getHouseNumberRangesRegex(String... delimiter) {
    String delimiters = String.join("", delimiter);
    return "("
        + NUMBER_WITH_LETTER_REGEX
        + "\\s*["
        + delimiters
        + "]\\s*"
        + "\\d*\\s*[A-Za-z]{0,3}"
        + ")";
  }

  private static final List<Pattern> HOUSE_NUMBER_PATTERNS =
      Arrays.asList(
          Pattern.compile(getHouseNumberRangesRegex("-", "/")),
          Pattern.compile("(" + NUMBER_WITH_LETTER_REGEX + ")"),
          Pattern.compile(getHouseNumberRangesRegex(",")));

  private static final List<Pattern> STREET_AND_HOUSE_NUMBER_PATTERNS =
      HOUSE_NUMBER_PATTERNS.stream()
          .map(Pattern::pattern)
          .map(houseNumberRegex -> Pattern.compile(STREET_PART_REGEX + houseNumberRegex))
          .toList();

  public static StreetAndHouseNumber splitPostalAddress(String postalAddress) {
    if (postalAddress == null) {
      return new StreetAndHouseNumber(null, null);
    }

    String trimmedPostalAddress = postalAddress.trim();

    return splitTrimmedPostalAddress(trimmedPostalAddress);
  }

  private static StreetAndHouseNumber splitTrimmedPostalAddress(String trimmedPostalAddress) {
    if (isHouseNumberOnly(trimmedPostalAddress)) {
      return new StreetAndHouseNumber(trimmedPostalAddress.trim(), null);
    }

    for (Pattern pattern : STREET_AND_HOUSE_NUMBER_PATTERNS) {
      Optional<StreetAndHouseNumber> streetAndHouseNumber =
          getStreetAndHouseNumber(pattern, trimmedPostalAddress.trim());
      if (streetAndHouseNumber.isPresent()) {
        return streetAndHouseNumber.get();
      }
    }

    return new StreetAndHouseNumber(trimmedPostalAddress.trim(), null);
  }

  private static Optional<StreetAndHouseNumber> getStreetAndHouseNumber(
      Pattern pattern, String postalAddress) {
    Matcher matcher = pattern.matcher(postalAddress);

    if (matcher.matches()) {
      String street = matcher.group(1).trim();
      String houseNumber = matcher.group(2).trim();
      return Optional.of(new StreetAndHouseNumber(street, houseNumber));
    }

    return Optional.empty();
  }

  private static boolean isHouseNumberOnly(String postalAddress) {
    return HOUSE_NUMBER_PATTERNS.stream()
        .anyMatch(pattern -> pattern.matcher(postalAddress.trim()).matches());
  }
}
