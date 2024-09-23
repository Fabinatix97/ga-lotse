/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum DoctorLetterValue implements ConvertibleToValueOptions {
  CONFIRMED("B", "bestätigt"),
  NO_REPLY("K", "keine Rückmeldung"),
  PARTIALLY_CONFIRMED("T", "teilbestätigt"),
  NOT_CONFIRMED("N", "nicht bestätigt");

  private final String value;

  private final String meaning;

  DoctorLetterValue(String value, String meaning) {
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

  public static String convertDoctorLetterValueToValue(
      de.eshg.schoolentry.domain.model.DoctorLetterValue doctorLetterValue) {
    return switch (doctorLetterValue) {
      case null -> null;
      case NO_REPLY -> NO_REPLY.getValue();
      case CONFIRMED -> CONFIRMED.getValue();
      case PARTIALLY_CONFIRMED -> PARTIALLY_CONFIRMED.getValue();
      case NOT_CONFIRMED -> NOT_CONFIRMED.getValue();
    };
  }
}
