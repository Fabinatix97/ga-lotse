/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(name = DecimalValueFilterParameterDto.SCHEMA_NAME)
public record DecimalValueFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute,
    @NotNull BigDecimal value,
    @NotNull NumericComparisonDto numericComparison,
    @NotNull boolean withNullValues)
    implements TableColumnFilterParameter, ValueFilterParameterDto<BigDecimal> {
  static final String SCHEMA_NAME = "DecimalValueFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
