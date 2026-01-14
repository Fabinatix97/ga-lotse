/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import java.time.Instant;

public interface OpenTaskSummaryRawData {
  int getCount();

  Instant getOldestStartDate();
}
