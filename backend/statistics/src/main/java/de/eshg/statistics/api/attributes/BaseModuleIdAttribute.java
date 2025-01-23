/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.attributes;

import static de.eshg.statistics.api.attributes.BaseModuleIdAttribute.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record BaseModuleIdAttribute(
    @NotBlank String name,
    @NotNull String code,
    @Schema @NotNull @Valid AbstractTableColumnHeaderAttribute baseAttribute)
    implements AbstractTableColumnHeaderAttribute {
  public static final String SCHEMA_NAME = "BaseModuleIdAttribute";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
