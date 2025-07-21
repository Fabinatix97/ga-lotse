/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum BirthWeight implements ConvertibleToValueOptions {
  CATEGORY_1("1", "<=499g"),
  CATEGORY_2("2", "500-999g"),
  CATEGORY_3("3", "1000-1499g"),
  CATEGORY_4("4", "1500-1999g"),
  CATEGORY_5("5", "2000-2499g"),
  CATEGORY_6("6", ">=2500g"),
  UNKNOWN("9", "unbekannt");

  private final String value;
  private final String meaning;

  BirthWeight(String value, String meaning) {
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
