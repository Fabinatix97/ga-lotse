/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Language implements ConvertibleToValueOptions {
  BULGARIAN("Bulgarisch"),
  CHINESE("Chinesisch"),
  GERMAN("Deutsch"),
  ENGLISH("Englisch"),
  FRENCH("Französisch"),
  GREEK("Griechisch"),
  ITALIAN("Italienisch"),
  POLISH("Polnisch"),
  PORTUGUESE("Portugiesisch"),
  ROMANIAN("Rumänisch"),
  RUSSIAN("Russisch"),
  SERBO_CROATIAN("Serbokroatisch"),
  SLOVAKIAN("Slowakisch"),
  SPANISH("Spanisch"),
  THAI("Thai"),
  CZECH("Tschechisch"),
  TURKISH("Türkisch"),
  UKRAINIAN("Ukrainisch"),
  HUNGARIAN("Ungarisch"),
  UNKNOWN("Unbekannt");

  private final String value;

  Language(String value) {
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

  public static String convertFamilyLanguageToValue(
      de.eshg.prostituteprotection.domain.model.Language value) {
    return switch (value) {
      case null -> null;
      case BULGARIAN -> BULGARIAN.getValue();
      case CHINESE -> CHINESE.getValue();
      case GERMAN -> GERMAN.getValue();
      case ENGLISH -> ENGLISH.getValue();
      case FRENCH -> FRENCH.getValue();
      case GREEK -> GREEK.getValue();
      case ITALIAN -> ITALIAN.getValue();
      case POLISH -> POLISH.getValue();
      case PORTUGUESE -> PORTUGUESE.getValue();
      case ROMANIAN -> ROMANIAN.getValue();
      case RUSSIAN -> RUSSIAN.getValue();
      case SERBO_CROATIAN -> SERBO_CROATIAN.getValue();
      case SLOVAKIAN -> SLOVAKIAN.getValue();
      case SPANISH -> SPANISH.getValue();
      case THAI -> THAI.getValue();
      case CZECH -> CZECH.getValue();
      case TURKISH -> TURKISH.getValue();
      case UKRAINIAN -> UKRAINIAN.getValue();
      case HUNGARIAN -> HUNGARIAN.getValue();
      case UNKNOWN -> UNKNOWN.getValue();
    };
  }
}
