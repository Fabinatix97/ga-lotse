/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.options;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Country implements ConvertibleToValueOptions {
  VALUE_0("0", "Deutschland"),
  VALUE_1("1", "Westeuropa"),
  VALUE_2("2", "Osteuropa"),
  VALUE_3("3", "Nordamerika, Australien, Neuseeland"),
  VALUE_4("4", "Mittel- und Südamerika"),
  VALUE_5("5", "Asien"),
  VALUE_6("6", "Afrika"),
  VALUE_7("7", "Türkei"),
  VALUE_8("8", "arabische Staaten"),
  VALUE_9("9", "Sonstige Staaten, unbekannt, staatenlos");

  private final String value;

  private final String meaning;

  Country(String value, String meaning) {
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

  public static String convertCountryCodeToValue(Integer countryCode) {
    if (countryCode == null) {
      return null;
    }
    return switch (countryCode) {
      case 0 -> VALUE_0.getValue();
      case 1 -> VALUE_1.getValue();
      case 2 -> VALUE_2.getValue();
      case 3 -> VALUE_3.getValue();
      case 4 -> VALUE_4.getValue();
      case 5 -> VALUE_5.getValue();
      case 6 -> VALUE_6.getValue();
      case 7 -> VALUE_7.getValue();
      case 8 -> VALUE_8.getValue();
      case 9 -> VALUE_9.getValue();
      default -> throw new IllegalArgumentException("Unexpected value: " + countryCode);
    };
  }
}
