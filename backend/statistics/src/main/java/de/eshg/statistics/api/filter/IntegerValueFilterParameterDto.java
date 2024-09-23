/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = IntegerValueFilterParameterDto.SCHEMA_NAME)
public record IntegerValueFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute,
    @NotNull Integer value,
    @NotNull NumericComparisonDto numericComparison,
    @NotNull boolean withNullValues)
    implements TableColumnFilterParameter {
  static final String SCHEMA_NAME = "IntegerValueFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
