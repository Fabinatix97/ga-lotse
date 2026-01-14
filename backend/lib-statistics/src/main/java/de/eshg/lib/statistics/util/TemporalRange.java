/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import java.time.temporal.Temporal;

public interface TemporalRange<T extends Temporal> {
  T start();

  T end();
}
