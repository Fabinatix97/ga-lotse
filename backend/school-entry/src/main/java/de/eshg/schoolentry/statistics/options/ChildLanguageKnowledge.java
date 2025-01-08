/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.GermanKnowledgeValue;

public enum ChildLanguageKnowledge implements ConvertibleToValueOptions {
  VALUE_1("1", "kein Deutsch"),
  VALUE_2("2", "schlecht"),
  VALUE_3("3", "flüssig, fehlerhaft"),
  VALUE_4("4", "flüssig mit kleinen Fehlern"),
  VALUE_5("5", "fehlerfrei"),
  VALUE_9("9", "nicht erhoben");

  private final String value;

  private final String meaning;

  ChildLanguageKnowledge(String value, String meaning) {
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

  @Override
  public boolean isUnknownValue() {
    return this.equals(VALUE_9);
  }

  public static String convertChildLanguageKnowledgeToValue(GermanKnowledgeValue value) {
    return switch (value) {
      case null -> null;
      case NO_GERMAN -> VALUE_1.getValue();
      case BAD -> VALUE_2.getValue();
      case FLUID_WITH_MAJOR_ERRORS -> VALUE_3.getValue();
      case FLUID_WITH_MINOR_ERRORS -> VALUE_4.getValue();
      case FAULTLESS -> VALUE_5.getValue();
      case UNKNOWN -> VALUE_9.getValue();
    };
  }
}
