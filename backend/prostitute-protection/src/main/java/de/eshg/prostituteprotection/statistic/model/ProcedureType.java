/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum ProcedureType implements ConvertibleToValueOptions {
  INITIAL("Erstberatung"),
  FOLLOW_UP("Folgeberatung");

  private final String value;

  ProcedureType(String value) {
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

  public static String convertProcedureTypeToValue(
      de.eshg.lib.procedure.domain.model.ProcedureType value) {
    return switch (value) {
      case PROSTITUTE_PROTECTION_INITIAL -> INITIAL.getValue();
      case PROSTITUTE_PROTECTION_FOLLOW_UP -> FOLLOW_UP.getValue();
      default ->
          throw new IllegalStateException(
              "Invalid procedure type for prostitute-protection: %s".formatted(value));
    };
  }
}
