/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = AutocompleteUserDto.SCHEMA_NAME)
public record AutocompleteUserDto(@NotNull UUID userId, String name)
    implements AutocompleteActorDto {
  public static final String SCHEMA_NAME = "InspectionSampleUserReference";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
