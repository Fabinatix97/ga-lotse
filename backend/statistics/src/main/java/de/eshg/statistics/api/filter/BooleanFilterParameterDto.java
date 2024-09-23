/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = BooleanFilterParameterDto.SCHEMA_NAME)
public record BooleanFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute,
    @NotNull boolean searchForTrue,
    @NotNull boolean searchForFalse,
    @NotNull boolean searchForNull)
    implements TableColumnFilterParameter {
  static final String SCHEMA_NAME = "BooleanFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
