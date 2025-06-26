/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum Group implements ConvertibleToValueOptions {
  OTHER("0", "Andere"),
  GROUP1("1", "Klasse 1"),
  GROUP2("2", "Klasse 2"),
  GROUP3("3", "Klasse 3"),
  GROUP4("4", "Klasse 4"),
  GROUP5("5", "Klasse 5"),
  GROUP6("6", "Klasse 6"),
  GROUP7("7", "Klasse 7"),
  GROUP8("8", "Klasse 8"),
  GROUP9("9", "Klasse 9"),
  GROUP10("10", "Klasse 10"),
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
      return GROUP10;
    }

    return switch (firstChar) {
      case '1' -> Group.GROUP1;
      case '2' -> Group.GROUP2;
      case '3' -> Group.GROUP3;
      case '4' -> Group.GROUP4;
      case '5' -> Group.GROUP5;
      case '6' -> Group.GROUP6;
      case '7' -> Group.GROUP7;
      case '8' -> Group.GROUP8;
      case '9' -> Group.GROUP9;
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
