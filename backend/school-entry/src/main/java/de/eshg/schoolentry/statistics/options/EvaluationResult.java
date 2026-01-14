/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum EvaluationResult implements ConvertibleToValueOptions {
  CONSPICUOUS("A", "auffällig"),
  BORDERLINE("G", "grenzwertig"),
  INCONSPICUOUS("U", "unauffällig"),
  UNKNOWN("unbekannt", "unbekannt");

  private final String value;

  private final String meaning;

  EvaluationResult(String value, String meaning) {
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
