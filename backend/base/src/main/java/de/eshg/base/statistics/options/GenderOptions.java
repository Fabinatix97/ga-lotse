/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics.options;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.Arrays;
import java.util.List;

public enum GenderOptions {
  MALE("M", "männlich"),
  FEMALE("W", "weiblich"),
  DIVERSE("D", "divers"),
  NOT_SPECIFIED("K", "keine Angabe");

  private final String value;

  private final String meaning;

  GenderOptions(String value, String meaning) {
    this.value = value;
    this.meaning = meaning;
  }

  public String getValue() {
    return value;
  }

  public String getMeaning() {
    return meaning;
  }

  public static List<ValueOptionInternal> convertToValueOptions() {
    return Arrays.stream(GenderOptions.values())
        .map(
            entry ->
                new ValueOptionInternal(
                    entry.getValue(), entry.getMeaning(), entry.equals(NOT_SPECIFIED)))
        .toList();
  }
}
