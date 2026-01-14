/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.ArrayList;
import java.util.List;

public class EsuAttributeUtil {
  private static final String UNKNOWN = "unbekannt";
  private static final String NO_INFORMATION = "keine Angabe";

  public static final int UNKNOWN_INTEGER_999 = 999;
  public static final double UNKNOWN_DECIMAL_99_9 = 99.9;

  private EsuAttributeUtil() {}

  static ValueOptionInternal createUnknownOption(String value) {
    return new ValueOptionInternal(value, UNKNOWN, true);
  }

  static List<ValueOptionInternal> createSiblingValueOptions() {
    List<ValueOptionInternal> options = new ArrayList<>();
    addNumberValueOptions(options, 0, 15);
    options.add(new ValueOptionInternal("K", NO_INFORMATION, true));
    return options;
  }

  static List<ValueOptionInternal> createVaccinationCountOptions() {
    List<ValueOptionInternal> options = new ArrayList<>();
    addNumberValueOptions(options, 0, 8);
    options.add(new ValueOptionInternal("9", UNKNOWN, true));
    return options;
  }

  static List<ValueOptionInternal> createDyslaliaOptions() {
    List<ValueOptionInternal> options = new ArrayList<>();
    addNumberValueOptions(options, 0, 10);
    options.add(new ValueOptionInternal("99", UNKNOWN, true));
    return options;
  }

  private static void addNumberValueOptions(List<ValueOptionInternal> options, int start, int end) {
    for (int i = start; i <= end; i++) {
      String value = "%d".formatted(i);
      options.add(new ValueOptionInternal(value, value, false));
    }
  }
}
