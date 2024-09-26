/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum BooleanWithUnknown implements ConvertibleToValueOptions {
  TRUE("Ja", "Ja"),
  FALSE("Nein", "Nein"),
  UNKNOWN("Unbekannt", "Unbekannt");

  private final String value;
  private final String meaning;

  BooleanWithUnknown(String value, String meaning) {
    this.value = value;
    this.meaning = meaning;
  }

  public static String convertToValue(de.eshg.schoolentry.domain.model.BooleanWithUnknown value) {
    return switch (value) {
      case null -> null;
      case TRUE -> BooleanWithUnknown.TRUE.getValue();
      case FALSE -> BooleanWithUnknown.FALSE.getValue();
      case UNKNOWN -> BooleanWithUnknown.UNKNOWN.getValue();
    };
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
}
