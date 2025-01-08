/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = ValueOptionFilterParameterDto.SCHEMA_NAME)
public record ValueOptionFilterParameterDto(
    @NotNull @Valid AttributeSelectionDto attribute,
    @NotNull List<String> searchValues,
    @NotNull boolean searchForNull)
    implements TableColumnFilterParameter {
  static final String SCHEMA_NAME = "ValueOptionFilterParameter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
