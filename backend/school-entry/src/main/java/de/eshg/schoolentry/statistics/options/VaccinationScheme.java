/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.VaccinationSchemeValue;

public enum VaccinationScheme implements ConvertibleToValueOptions {
  SCHEME_2_PLUS_1("2", "2+1"),
  SCHEME_3_PLUS_1_3("3", "3+1"),
  UNKNOWN("9", "unbekannt");

  private final String value;

  private final String meaning;

  VaccinationScheme(String value, String meaning) {
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

  @Override
  public boolean isUnknownValue() {
    return this.equals(UNKNOWN);
  }

  public static String convertVaccinationSchemeToValue(VaccinationSchemeValue value) {
    return switch (value) {
      case null -> null;
      case SCHEME_2_PLUS_1 -> SCHEME_2_PLUS_1.getValue();
      case SCHEME_3_PLUS_1 -> SCHEME_3_PLUS_1_3.getValue();
      case UNKNOWN -> UNKNOWN.getValue();
    };
  }
}
