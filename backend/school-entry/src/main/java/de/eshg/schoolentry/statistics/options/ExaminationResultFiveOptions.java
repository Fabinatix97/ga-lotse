/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum ExaminationResultFiveOptions implements ConvertibleToValueOptions {
  OK("I", "in Ordnung"),
  KNOWN("B", "Bekannt/Behandelt"),
  DOCTOR_LETTER("A", "Arztbrief"),
  BORDERLINE("G", "grenzwertig"),
  UNKNOWN("U", "Unbekannt");

  private final String value;

  private final String meaning;

  ExaminationResultFiveOptions(String value, String meaning) {
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
