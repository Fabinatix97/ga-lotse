/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.attributes;

import static de.eshg.statistics.api.attributes.DecimalAttribute.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record DecimalAttribute(
    @NotBlank String name,
    @NotNull String code,
    String unit,
    @Valid List<ValueOption> valueOptions,
    BigDecimal minValue,
    BigDecimal maxValue)
    implements AbstractTableColumnHeaderAttribute {
  public static final String SCHEMA_NAME = "DecimalAttribute";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
