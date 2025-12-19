/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum OralHygieneStatus implements ConvertibleToValueOptions {
  EXCELLENT("Sehr gut", "Sehr gut"),
  GOOD("Gut", "Gut"),
  POOR("Schlecht", "Schlecht");

  private final String value;
  private final String meaning;

  OralHygieneStatus(String value, String meaning) {
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

  public static String convertOralHygieneStatusToValue(
      de.eshg.dental.domain.model.OralHygieneStatus status) {
    return switch (status) {
      case null -> null;
      case EXCELLENT -> EXCELLENT.getValue();
      case GOOD -> GOOD.getValue();
      case POOR -> POOR.getValue();
    };
  }
}
