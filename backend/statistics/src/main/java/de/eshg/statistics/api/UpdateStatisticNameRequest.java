/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import static de.eshg.statistics.api.UpdateStatisticNameRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = SCHEMA_NAME)
public record UpdateStatisticNameRequest(@NotBlank String name)
    implements AbstractUpdateStatisticRequest {
  public static final String SCHEMA_NAME = "UpdateStatisticNameRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
