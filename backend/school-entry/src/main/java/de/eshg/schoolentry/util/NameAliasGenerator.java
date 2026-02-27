/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.base.GenderDto;
import java.util.List;
import java.util.UUID;

public final class NameAliasGenerator {

  static final List<String> MALE_FIRST_NAMES =
      List.of(
          "Matteo",
          "Noah",
          "Leon",
          "Finn",
          "Elias",
          "Paul",
          "Ben",
          "Luca",
          "Emil",
          "Louis",
          "Felix",
          "Jonas",
          "Henry",
          "Maximilian",
          "Oskar",
          "Milan",
          "Theo",
          "Anton",
          "Liam",
          "Julian");

  static final List<String> FEMALE_FIRST_NAMES =
      List.of(
          "Emilia",
          "Hannah",
          "Mia",
          "Emma",
          "Sophia",
          "Mila",
          "Lina",
          "Ella",
          "Lea",
          "Clara",
          "Leni",
          "Marie",
          "Ida",
          "Mathilda",
          "Frieda",
          "Lia",
          "Lilly",
          "Luisa",
          "Amelie",
          "Nele");

  static final List<String> GENDER_NEUTRAL_FIRST_NAMES =
      List.of(
          "Luca", "Mika", "Lou", "Jona", "Charlie", "Toni", "Jamie", "Elia", "Jules", "Billie",
          "Nicola");

  static final List<String> LAST_NAMES =
      List.of(
          "Schmidt",
          "Schneider",
          "Fischer",
          "Weber",
          "Meyer",
          "Wagner",
          "Becker",
          "Schulz",
          "Hoffmann",
          "Koch",
          "Bauer",
          "Richter",
          "Klein",
          "Wolf",
          "Neumann",
          "Schwarz",
          "Zimmermann");

  private NameAliasGenerator() {}

  public static NameAlias generateAlias(
      UUID procedureId, GenderDto gender, String firstName, String lastName) {
    int hash = String.format("%s:%s:%s", procedureId, firstName, lastName).hashCode();

    List<String> firstNames =
        switch (gender) {
          case FEMALE -> FEMALE_FIRST_NAMES;
          case MALE -> MALE_FIRST_NAMES;
          default -> GENDER_NEUTRAL_FIRST_NAMES;
        };

    String firstNameAlias = firstNames.get(computeIndex(hash, firstNames.size()));
    String lastNameAlias = LAST_NAMES.get(computeIndex(hash * 31, LAST_NAMES.size()));

    return new NameAlias(firstNameAlias, lastNameAlias);
  }

  private static int computeIndex(int hash, int size) {
    return (hash & Integer.MAX_VALUE) % size;
  }

  public record NameAlias(String firstName, String lastName) {}
}
