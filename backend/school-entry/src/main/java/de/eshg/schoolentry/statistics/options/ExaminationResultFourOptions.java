/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.ExaminationResultValue;

public enum ExaminationResultFourOptions implements ConvertibleToValueOptions {
  OK("I", "in Ordnung"),
  KNOWN("B", "Bekannt/Behandelt"),
  DOCTOR_LETTER("A", "Arztbrief"),
  UNKNOWN("U", "Unbekannt");

  private final String value;

  private final String meaning;

  ExaminationResultFourOptions(String value, String meaning) {
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

  public static String convertExaminationResultToValue(ExaminationResultValue examinationResult) {
    return switch (examinationResult) {
      case null -> null;
      case OK -> ExaminationResultFourOptions.OK.getValue();
      case KNOWN -> ExaminationResultFourOptions.KNOWN.getValue();
      case DOCTOR_LETTER -> ExaminationResultFourOptions.DOCTOR_LETTER.getValue();
      case UNKNOWN -> ExaminationResultFourOptions.UNKNOWN.getValue();
    };
  }

  @Override
  public boolean isUnknownValue() {
    return this.equals(UNKNOWN);
  }
}
