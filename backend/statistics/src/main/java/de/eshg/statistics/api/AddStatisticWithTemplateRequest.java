/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import static de.eshg.statistics.api.AddStatisticWithTemplateRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddStatisticWithTemplateRequest(
    @NotBlank String name,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull boolean anonymized,
    @NotNull UUID templateId)
    implements AbstractAddStatisticRequest {
  public static final String SCHEMA_NAME = "AddStatisticWithTemplateRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
