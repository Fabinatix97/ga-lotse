/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import java.time.Duration;

public class DurationUtil {

  private DurationUtil() {}

  public static boolean isDivisible(Duration dividend, Duration divisor) {
    long factor = dividend.dividedBy(divisor);
    return divisor.multipliedBy(factor).equals(dividend);
  }
}
