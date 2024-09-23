/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record Attribute(
    @NotBlank String name,
    @NotNull String code,
    @NotNull ValueType valueType,
    SubjectType subjectType,
    String unit,
    @Size(min = 1) @Valid List<ValueOptionInternal> valueOptions,
    @NotBlank String category,
    @NotNull boolean mandatory) {

  public Attribute(
      String name, String code, SubjectType subjectType, String category, boolean mandatory) {
    this(name, code, ValueType.CENTRAL_FILE_ID, subjectType, null, null, category, mandatory);
  }

  public Attribute(
      String name,
      String code,
      ValueType valueType,
      String unit,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    this(name, code, valueType, null, unit, valueOptions, category, mandatory);
  }
}
