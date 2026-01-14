/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = IntegerRangeFilterParameterDto.SCHEMA_NAME)
public record IntegerRangeFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute,
    @NotNull Integer minValueInclusive,
    @NotNull Integer maxValueInclusive,
    @NotNull boolean withNullValues)
    implements TableColumnFilterParameter, RangeFilterParameterDto<Integer> {
  static final String SCHEMA_NAME = "IntegerRangeFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
