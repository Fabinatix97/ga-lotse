/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api.interval;

import static de.eshg.lib.statistics.api.interval.IntegerIntervalBordersConfiguration.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record IntegerIntervalBordersConfiguration(
    @NotNull @Size(min = 2) List<Integer> intervalBorders) implements IntervalConfiguration {
  public static final String SCHEMA_NAME = "IntegerIntervalBordersConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
