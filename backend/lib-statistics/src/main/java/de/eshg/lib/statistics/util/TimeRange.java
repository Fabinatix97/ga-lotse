/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import java.time.Instant;

public record TimeRange(Instant start, Instant end) implements TemporalRange<Instant> {
  public static TimeRange fromRequest(GetSpecificDataRequest getSpecificDataRequest) {
    return new TimeRange(
        getSpecificDataRequest.timeRangeStart(), getSpecificDataRequest.timeRangeEnd());
  }
}
