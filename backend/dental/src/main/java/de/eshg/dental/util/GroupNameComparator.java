/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.util;

public class GroupNameComparator {
  private GroupNameComparator() {}

  public static int compareGroupNames(String a, String b) {
    String numberStringA = getNumberStringAtBeginning(a);
    String numberStringB = getNumberStringAtBeginning(b);
    boolean aStartsWithMultipleNumbers = numberStringA.length() > 1;
    boolean bStartsWithMultipleNumbers = numberStringB.length() > 1;

    if (numberStringA.isBlank() || numberStringB.isBlank() || numberStringA.equals(numberStringB)) {
      return a.compareTo(b);
    }
    if (aStartsWithMultipleNumbers || bStartsWithMultipleNumbers) {
      return Integer.compare(Integer.parseInt(numberStringA), Integer.parseInt(numberStringB));
    }
    return a.compareTo(b);
  }

  private static String getNumberStringAtBeginning(String s) {
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
      if (Character.isDigit(c)) {
        sb.append(c);
      } else {
        break;
      }
    }
    return sb.toString();
  }
}
