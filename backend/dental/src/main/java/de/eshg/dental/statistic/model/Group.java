/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Group implements ConvertibleToValueOptions {
  OTHER("0", "Andere"),
  GROUP1_4("4", "Grundschule"),
  GROUP5_6("6", "Klasse 5/6"),
  GROUP7_10("10", "Klasse 7-10"),
  ;

  private final String value;
  private final String meaning;

  Group(String value, String meaning) {
    this.value = value;
    this.meaning = meaning;
  }

  public static Group convertToGroupValue(String groupName) {
    if (groupName == null || groupName.trim().isEmpty()) {
      return OTHER;
    }
    groupName = groupName.trim();
    char firstChar = groupName.charAt(0);
    if (groupName.length() > 2 && firstChar == '1' && groupName.charAt(1) == '0') {
      return GROUP7_10;
    }

    return switch (firstChar) {
      case '1', '2', '3', '4' -> Group.GROUP1_4;
      case '5', '6' -> Group.GROUP5_6;
      case '7', '8', '9' -> Group.GROUP7_10;
      default -> Group.OTHER;
    };
  }

  @Override
  public String getValue() {
    return this.value;
  }

  @Override
  public String getMeaning() {
    return this.meaning;
  }
}
