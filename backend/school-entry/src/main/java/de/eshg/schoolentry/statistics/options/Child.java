/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Child implements ConvertibleToValueOptions {
  REGULAR("Regel", "Regelkind"),
  CAN_CHILD("Kann", "Kannkind"),
  ENTRY_LEVEL("Eingangsstufe", "Eingangsstufe");

  private final String value;

  private final String meaning;

  Child(String value, String meaning) {
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

  public static String convertTypeToValue(ProcedureType type) {
    return switch (type) {
      case REGULAR_EXAMINATION -> REGULAR.getValue();
      case CAN_CHILD -> CAN_CHILD.getValue();
      case ENTRY_LEVEL -> ENTRY_LEVEL.getValue();
      default -> "";
    };
  }
}
