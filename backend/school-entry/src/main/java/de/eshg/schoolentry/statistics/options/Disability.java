/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.DisabilityType;

public enum Disability implements ConvertibleToValueOptions {
  PHYSICAL("K", "körperlich"),
  MENTAL("G", "geistig"),
  EMOTIONAL("S", "seelisch"),
  MULTIPLE("M", "mehrfach");

  private final String value;

  private final String meaning;

  Disability(String value, String meaning) {
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

  public static String convertDisabilityTypeToValue(DisabilityType disabilityType) {
    return switch (disabilityType) {
      case null -> null;
      case PHYSICAL -> PHYSICAL.getValue();
      case MENTAL -> MENTAL.getValue();
      case EMOTIONAL -> EMOTIONAL.getValue();
      case MULTIPLE -> MULTIPLE.getValue();
    };
  }
}
