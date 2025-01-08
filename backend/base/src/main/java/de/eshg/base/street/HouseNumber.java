/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;

public record HouseNumber(int number, String suffix) implements Comparable<HouseNumber> {

  private static final String REGEX = StreetApi.HOUSE_NUMBER_REGEXP;

  public static HouseNumber parseHouseNumber(String houseNumber) {
    if (StringUtils.isBlank(houseNumber)) {
      return null;
    }

    Pattern pattern = Pattern.compile(REGEX);
    Matcher matcher = pattern.matcher(houseNumber);

    if (matcher.find()) {
      int number = Integer.parseInt(matcher.group(1)); // The numeric part
      String suffix = matcher.group(2); // The suffix, which might be empty

      return new HouseNumber(number, suffix);
    } else {
      throw new IllegalArgumentException("Invalid house number format: " + houseNumber);
    }
  }

  public HouseNumber(int number, String suffix) {
    this.number = number;
    this.suffix = suffix == null ? "" : suffix;
  }

  public HouseNumber(int houseNumber) {
    this(houseNumber, "");
  }

  @Override
  public int compareTo(HouseNumber otherHouseNumber) {
    if (isOnEdge(number, otherHouseNumber)) {
      return suffix.compareTo(otherHouseNumber.suffix);
    }

    return Integer.compare(number, otherHouseNumber.number);
  }

  private static boolean isOnEdge(int houseNumber, HouseNumber from) {
    return from.number() == houseNumber;
  }
}
