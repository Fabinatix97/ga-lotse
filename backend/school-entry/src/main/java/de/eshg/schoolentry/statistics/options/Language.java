/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;
import de.eshg.schoolentry.domain.model.FamilyLanguageValue;

public enum Language implements ConvertibleToValueOptions {
  VALUE_00("00", "deutsch"),
  VALUE_01("01", "türkisch"),
  VALUE_02("02", "kurdisch"),
  VALUE_03("03", "russisch"),
  VALUE_04("04", "polnisch"),
  VALUE_05("05", "arabisch"),
  VALUE_06("06", "farsi/dari"),
  VALUE_07("07", "serbokroatisch"),
  VALUE_08("08", "rumänisch"),
  VALUE_09("09", "bulgarisch"),
  VALUE_10("10", "pashtu"),
  VALUE_11("11", "tigrinia"),
  VALUE_12("12", "berberisch"),
  VALUE_13("13", "amharisch"),
  VALUE_14("14", "aramäisch"),
  VALUE_15("15", "italienisch"),
  VALUE_16("16", "spanisch"),
  VALUE_17("17", "griechisch"),
  VALUE_18("18", "portugiesisch"),
  VALUE_19("19", "englisch"),
  VALUE_20("20", "französisch"),
  VALUE_21("21", "urdu"),
  VALUE_22("22", "weitere europ. Sprachen"),
  VALUE_23("23", "weitere asiatische Sprachen"),
  VALUE_24("24", "weitere afrikanische Sprachen"),
  VALUE_25("25", "sonstige Sprachen"),
  VALUE_99("99", "unbekannt");

  private final String value;

  private final String meaning;

  Language(String value, String meaning) {
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
    return this.equals(VALUE_99);
  }

  public static String convertFamilyLanguageToValue(FamilyLanguageValue value) {
    return switch (value) {
      case null -> null;
      case GERMAN -> VALUE_00.getValue();
      case TURKISH -> VALUE_01.getValue();
      case KURDISH -> VALUE_02.getValue();
      case RUSSIAN -> VALUE_03.getValue();
      case POLISH -> VALUE_04.getValue();
      case ARABIC -> VALUE_05.getValue();
      case FARSI_DARI -> VALUE_06.getValue();
      case SERBO_CROATIAN -> VALUE_07.getValue();
      case ROMAN -> VALUE_08.getValue();
      case BULGARIAN -> VALUE_09.getValue();
      case PASHTU -> VALUE_10.getValue();
      case TIGRINIA -> VALUE_11.getValue();
      case BERBERIAN -> VALUE_12.getValue();
      case AMHARIAN -> VALUE_13.getValue();
      case ARAMEAN -> VALUE_14.getValue();
      case ITALIAN -> VALUE_15.getValue();
      case SPANISH -> VALUE_16.getValue();
      case GREEK -> VALUE_17.getValue();
      case PORTUGUESE -> VALUE_18.getValue();
      case ENGLISH -> VALUE_19.getValue();
      case FRENCH -> VALUE_20.getValue();
      case URDU -> VALUE_21.getValue();
      case OTHER_EUROPEAN_LANGUAGES -> VALUE_22.getValue();
      case OTHER_ASIAN_LANGUAGES -> VALUE_23.getValue();
      case OTHER_AFRICAN_LANGUAGES -> VALUE_24.getValue();
      case OTHER_LANGUAGES -> VALUE_25.getValue();
      case UNKNOWN -> VALUE_99.getValue();
    };
  }
}
