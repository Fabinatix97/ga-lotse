/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = DateFilterParameterDto.SCHEMA_NAME)
public record DateFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute, @NotNull String date)
    implements TableColumnFilterParameter {
  static final String SCHEMA_NAME = "DateFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
