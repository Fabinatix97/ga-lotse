/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class PersonalDataNormalizer {

  private PersonalDataNormalizer() {}

  private static final String DELIMITER = "_";

  public static String createNormalizedPersonalData(
      String firstName, String lastName, LocalDate dateOfBirth) {
    String normalizedFirstName = normalizeName(firstName);
    String normalizedLastName = normalizeName(lastName);
    String normalizedDateOfBirth = normalizeDate(dateOfBirth);

    return String.join(DELIMITER, normalizedFirstName, normalizedLastName, normalizedDateOfBirth);
  }

  private static String normalizeName(String input) {
    if (input == null) return "";

    // unicode NFKD
    String normalized = Normalizer.normalize(input, Normalizer.Form.NFKD);

    // remove diacritics
    normalized = normalized.replaceAll("\\p{M}", "");

    // only latin letters and numbers
    normalized = normalized.replaceAll("[^A-Za-z0-9]", "");

    if (normalized.isEmpty()) {
      throw new IllegalArgumentException("Normalized name contains no valid characters: " + input);
    }

    // lower case
    return normalized.toLowerCase(Locale.ROOT);
  }

  private static String normalizeDate(LocalDate date) {
    // yyyyMMdd
    return date.format(DateTimeFormatter.BASIC_ISO_DATE);
  }
}
