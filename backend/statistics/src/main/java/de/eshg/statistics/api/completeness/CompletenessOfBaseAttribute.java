/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.completeness;

import static de.eshg.statistics.api.completeness.CompletenessOfBaseAttribute.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record CompletenessOfBaseAttribute(
    @NotBlank String businessModuleName,
    @NotNull UUID dataSourceId,
    @NotBlank String businessAttributeCode,
    @NotBlank String businessAttributeName,
    @NotBlank String baseAttributeCode,
    @NotBlank String baseAttributeName,
    @NotNull boolean mandatory,
    String unknownValue,
    BigDecimal percentUnknown,
    @NotNull BigDecimal percentNull,
    @NotNull BigDecimal percentSum)
    implements CompletenessOfAttribute {
  public static final String SCHEMA_NAME = "CompletenessOfBaseAttribute";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
