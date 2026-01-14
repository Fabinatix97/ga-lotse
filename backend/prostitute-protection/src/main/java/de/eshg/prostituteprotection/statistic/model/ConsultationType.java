/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum ConsultationType implements ConvertibleToValueOptions {
  INITIAL("Erstkonsultation"),
  FOLLOW_UP("Folgekonsultation");

  private final String value;

  ConsultationType(String value) {
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

  public static String convertConsultationTypeToValue(
      de.eshg.prostituteprotection.domain.model.ConsultationType type) {
    return switch (type) {
      case null -> null;
      case INITIAL -> INITIAL.getValue();
      case FOLLOW_UP -> FOLLOW_UP.getValue();
    };
  }
}
