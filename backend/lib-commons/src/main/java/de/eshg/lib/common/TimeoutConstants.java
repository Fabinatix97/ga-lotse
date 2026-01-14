/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

import java.time.Duration;

public final class TimeoutConstants {

  public static final int LONG_RUNNING_OPERATION_TIMEOUT_SECONDS = 120;
  public static final Duration LONG_RUNNING_OPERATION_TIMEOUT =
      Duration.ofSeconds(LONG_RUNNING_OPERATION_TIMEOUT_SECONDS);

  private TimeoutConstants() {}
}
