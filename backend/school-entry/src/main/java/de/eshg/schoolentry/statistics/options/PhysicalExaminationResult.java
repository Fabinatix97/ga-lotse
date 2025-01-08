/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum PhysicalExaminationResult implements ConvertibleToValueOptions {
  WITHOUT_FINDINGS("OB", "ohne Befund"),
  WITH_FINDINGS("MB", "mit Befund"),
  UNKNOWN("U", "unbekannt");

  private final String value;

  private final String meaning;

  PhysicalExaminationResult(String value, String meaning) {
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
