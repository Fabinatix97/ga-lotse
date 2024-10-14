/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import static de.eshg.statistics.api.UpdateStatisticTimeRangeRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record UpdateStatisticTimeRangeRequest(@NotNull @Valid TimeRange timeRange)
    implements AbstractUpdateStatisticRequest {
  public static final String SCHEMA_NAME = "UpdateStatisticTimeRangeRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
