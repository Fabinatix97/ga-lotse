/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.ArrayList;
import java.util.List;

public class EsuAttributeUtil {
  static final String ATTRIBUTE_CATEGORY_PROCEDURE_REFERENCE = "Vorgangsreferenz";
  static final String ATTRIBUTE_CATEGORY_CHILD = "Kind";
  static final String ATTRIBUTE_CATEGORY_ANAMNESIS = "Anamnese";
  static final String ATTRIBUTE_CATEGORY_VACCINATION = "Impfungen";
  static final String ATTRIBUTE_CATEGORY_S1_RESULT = "S1-Befund";
  static final String ATTRIBUTE_CATEGORY_VISION_HEARING = "Seh- und Hörscreening";
  static final String ATTRIBUTE_CATEGORY_S1_SOPESS = "S1-Sopess";
  static final String ATTRIBUTE_CATEGORY_PROCEDURE_INFOS = "Vorgang";

  private static final String UNKNOWN = "unbekannt";

  private static final String NO_INFORMATION = "keine Angabe";

  static final String CONSPICUOUS = "auffällig";
  static final String INCONSPICUOUS = "unauffällig";

  public static final int UNKNOWN_INTEGER_999 = 999;
  public static final double UNKNOWN_DECIMAL_99_9 = 99.9;

  private EsuAttributeUtil() {}

  static List<ValueOptionInternal> createUnknownSingleOption(String value) {
    return List.of(new ValueOptionInternal(value, UNKNOWN, true));
  }

  static List<ValueOptionInternal> createSiblingValueOptions() {
    List<ValueOptionInternal> options = new ArrayList<>();
    addNumberValueOptions(options, 0, 15);
    options.add(new ValueOptionInternal("K", NO_INFORMATION, true));
    return options;
  }

  static List<ValueOptionInternal> createVaccinationCountOptions() {
    List<ValueOptionInternal> options = new ArrayList<>();
    addNumberValueOptions(options, 1, 8);
    options.add(new ValueOptionInternal("9", UNKNOWN, true));
    return options;
  }

  static List<ValueOptionInternal> createDyslaliaOptions() {
    List<ValueOptionInternal> options = new ArrayList<>();
    addNumberValueOptions(options, 0, 10);
    options.add(new ValueOptionInternal("99", UNKNOWN, true));
    return options;
  }

  static List<ValueOptionInternal> createTeamOptions() {
    // configurable?
    return List.of(
        new ValueOptionInternal("01", "SG Nord", false),
        new ValueOptionInternal("02", "SG Süd", false));
  }

  private static void addNumberValueOptions(List<ValueOptionInternal> options, int start, int end) {
    for (int i = start; i <= end; i++) {
      String value = "%d".formatted(i);
      options.add(new ValueOptionInternal(value, value, false));
    }
  }
}
