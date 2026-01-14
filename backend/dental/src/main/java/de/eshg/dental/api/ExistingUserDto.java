/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = ExistingUserDto.SCHEMA_NAME)
public record ExistingUserDto(@NotNull UUID id, @NotNull String firstName, @NotNull String lastName)
    implements PerformingPersonDto {
  public static final String SCHEMA_NAME = "ExistingUser";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
