/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = AutocompleteContactDto.SCHEMA_NAME)
public record AutocompleteContactDto(@NotNull UUID contactId, String name)
    implements AutocompleteActorDto {
  public static final String SCHEMA_NAME = "AutocompleteContact";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
