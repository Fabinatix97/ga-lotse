/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum MihStatus implements ConvertibleToValueOptions {
  MILD("Leicht"),
  MODERATE("Moderat"),
  SERIOUS("Schwer");

  private final String value;

  MihStatus(String value) {
    this.value = value;
  }

  @Override
  public String getValue() {
    return value;
  }

  @Override
  public String getMeaning() {
    return value;
  }

  public static String convertMihStatusToValue(de.eshg.dental.domain.model.MihStatus status) {
    return switch (status) {
      case null -> null;
      case MILD -> MILD.getValue();
      case MODERATE -> MODERATE.getValue();
      case SERIOUS -> SERIOUS.getValue();
    };
  }
}
