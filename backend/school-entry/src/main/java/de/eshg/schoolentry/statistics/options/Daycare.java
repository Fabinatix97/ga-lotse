/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Daycare implements ConvertibleToValueOptions {
  NO("0", "kein Besuch"),
  MONTH_18("1", "< 18 Monate"),
  MONTH_18_TO_YEARS_3("2", "18 Monate - 3 Jahre"),
  YEARS_3("3", "> 3 Jahre"),
  UNKNOWN("9", "unbekannt");

  private final String value;
  private final String meaning;

  Daycare(String value, String meaning) {
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
}
