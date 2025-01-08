/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.LanguageKnowledgeValue;

public enum GuardianLanguageKnowledge implements ConvertibleToValueOptions {
  VALUE_1("1", "rudimentär"),
  VALUE_2("2", "fehlerhaft"),
  VALUE_3("3", "fehlerfrei"),
  VALUE_9("9", "unbekannt");

  private final String value;

  private final String meaning;

  GuardianLanguageKnowledge(String value, String meaning) {
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

  public static String convertLanguageKnowledgeToValue(LanguageKnowledgeValue value) {
    return switch (value) {
      case null -> null;
      case RUDIMENTARY -> VALUE_1.getValue();
      case FAULTY -> VALUE_2.getValue();
      case FAULTLESS -> VALUE_3.getValue();
      case UNKNOWN -> VALUE_9.getValue();
    };
  }
}
