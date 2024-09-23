/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.attributes;

import static de.eshg.statistics.api.attributes.ProcedureIdAttribute.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record ProcedureIdAttribute(@NotBlank String name, @NotNull String code)
    implements AbstractTableColumnHeaderAttribute {
  public static final String SCHEMA_NAME = "ProcedureIdAttribute";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
