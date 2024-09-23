/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.Arrays;
import java.util.List;

public class ConvertToValueOptionHelper {
  private ConvertToValueOptionHelper() {}

  public static List<ValueOptionInternal> convertToValueOptions(
      ConvertibleToValueOptions[] convertibles) {
    return Arrays.stream(convertibles)
        .map(
            entry ->
                new ValueOptionInternal(
                    entry.getValue(), entry.getMeaning(), entry.isUnknownValue()))
        .toList();
  }
}
