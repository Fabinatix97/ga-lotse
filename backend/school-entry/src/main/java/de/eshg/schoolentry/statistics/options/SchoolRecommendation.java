/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum SchoolRecommendation implements ConvertibleToValueOptions {
  BACK_REGULAR("ZURK", "Zurückstellung Regelkind"),
  BACK_ENTRY_LEVEL("ZUEK", "Zurückstellung Eingangsstufenkind"),
  CONCERN("BEKK", "Bedenken gegen vorzeitige Einschulung"),
  ADVICE_CENTER("BFZ", "Beratungs- und Förderzentrum"),
  NO("Nein", "Nein");

  private final String value;

  private final String meaning;

  SchoolRecommendation(String value, String meaning) {
    this.value = value;
    this.meaning = meaning;
  }

  @Override
  public String getValue() {
    return value;
  }

  @Override
  public String getMeaning() {
    return meaning;
  }

  public static String convertSchoolRecommendationToValue(
      de.eshg.schoolentry.domain.model.SchoolRecommendation schoolRecommendation) {
    return switch (schoolRecommendation) {
      case null -> null;
      case BACK_REGULAR -> BACK_REGULAR.getValue();
      case BACK_ENTRY_LEVEL -> BACK_ENTRY_LEVEL.getValue();
      case CONCERNS_EARLY_ENROLMENT -> CONCERN.getValue();
      case ADVICE_CENTER -> ADVICE_CENTER.getValue();
      case NO -> NO.getValue();
    };
  }
}
