/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum DecayStatus implements ConvertibleToValueOptions {
  HEALTHY("Gesund"),
  RESTORED("Saniert"),
  TREATMENT_REQUIRED("Behandlungsbedürftig");

  private final String value;

  DecayStatus(String value) {
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

  public static String convertDecayStatusToValue(de.eshg.dental.domain.model.DecayStatus status) {
    return switch (status) {
      case null -> null;
      case HEALTHY -> HEALTHY.getValue();
      case RESTORED -> RESTORED.getValue();
      case TREATMENT_REQUIRED -> TREATMENT_REQUIRED.getValue();
    };
  }
}
