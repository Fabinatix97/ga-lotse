/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = NonExistingUserDto.SCHEMA_NAME)
public record NonExistingUserDto(@NotNull UUID id) implements PerformingPersonDto {
  public static final String SCHEMA_NAME = "NonExistingUser";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
