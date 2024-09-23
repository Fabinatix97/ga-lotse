/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import static de.eshg.statistics.api.AddStatisticWithSchemeRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddStatisticWithSchemeRequest(
    @NotBlank String name,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull UUID schemeId)
    implements AbstractAddStatisticRequest {
  public static final String SCHEMA_NAME = "AddStatisticWithSchemeRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
