/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import de.eshg.base.user.api.UserDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = InspectionSampleUserDto.SCHEMA_NAME)
public record InspectionSampleUserDto(@NotNull @Valid UserDto user)
    implements InspectionSampleActorDto {
  public static final String SCHEMA_NAME = "InspectionSampleUser";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
