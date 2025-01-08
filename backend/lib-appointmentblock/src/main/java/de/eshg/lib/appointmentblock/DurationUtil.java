/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import java.time.Duration;

public class DurationUtil {

  private DurationUtil() {}

  public static boolean isDivisible(Duration dividend, Duration divisor) {
    long factor = dividend.dividedBy(divisor);
    return divisor.multipliedBy(factor).equals(dividend);
  }
}
