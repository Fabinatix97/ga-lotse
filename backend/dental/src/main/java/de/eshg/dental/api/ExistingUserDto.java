/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = ExistingUserDto.SCHEMA_NAME)
public record ExistingUserDto(@NotNull String firstName, @NotNull String lastName)
    implements PerformingPersonDto {
  public static final String SCHEMA_NAME = "ExistingUser";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
