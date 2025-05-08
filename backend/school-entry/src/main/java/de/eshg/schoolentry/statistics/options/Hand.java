/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.HandednessValue;

public enum Hand implements ConvertibleToValueOptions {
  RIGHT("R", "rechts"),
  LEFT("L", "links"),
  UNSURE("X", "unsicher"),
  UNKNOWN("U", "unbekannt");

  private final String value;

  private final String meaning;

  Hand(String value, String meaning) {
    this.value = value;
    this.meaning = meaning;
  }

  public static String convertHandednessValueToValue(HandednessValue handness) {
    return switch (handness) {
      case null -> null;
      case RIGHT -> RIGHT.getValue();
      case LEFT -> LEFT.getValue();
      case UNCERTAIN -> UNSURE.getValue();
      case UNKNOWN -> UNKNOWN.getValue();
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
