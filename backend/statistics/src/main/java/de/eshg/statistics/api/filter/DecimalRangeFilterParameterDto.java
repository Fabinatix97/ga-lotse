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

@Schema(name = DecimalRangeFilterParameterDto.SCHEMA_NAME)
public record DecimalRangeFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute,
    @NotNull BigDecimal minValueInclusive,
    @NotNull BigDecimal maxValueInclusive,
    @NotNull boolean withNullValues)
    implements TableColumnFilterParameter {
  static final String SCHEMA_NAME = "DecimalRangeFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
