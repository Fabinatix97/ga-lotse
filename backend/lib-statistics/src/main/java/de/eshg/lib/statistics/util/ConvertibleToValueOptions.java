/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

public interface ConvertibleToValueOptions {
  String getValue();

  String getMeaning();

  default boolean isUnknownValue() {
    return false;
  }
}
