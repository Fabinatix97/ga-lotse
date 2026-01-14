/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api.interval;

import static de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record IntegerMinMaxCountIntervalConfiguration(
    @NotNull int minInclusive, @NotNull int maxInclusive, @NotNull int countIntervals)
    implements IntervalConfiguration {
  public static final String SCHEMA_NAME = "IntegerMinMaxCountIntervalConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
