/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Articulation implements ConvertibleToValueOptions {
  VALUE_0("0", "unauffällig"),
  VALUE_1("1", "auffällig"),
  VALUE_9("9", "unbekannt");

  private final String value;

  private final String meaning;

  Articulation(String value, String meaning) {
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
    return this.equals(VALUE_9);
  }
}
