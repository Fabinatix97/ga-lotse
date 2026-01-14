/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.attributes;

import static de.eshg.statistics.api.attributes.TextAttribute.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record TextAttribute(
    @NotBlank String name, @NotNull String code, @Valid List<ValueOption> valueOptions)
    implements AbstractTableColumnHeaderAttribute {
  public static final String SCHEMA_NAME = "TextAttribute";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
