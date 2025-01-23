/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = ScreeningExaminationResultDto.SCHEMA_NAME)
public record ScreeningExaminationResultDto(
    @NotNull boolean fluorideVarnishApplied, OralHygieneStatusDto oralHygieneStatus)
    implements ExaminationResultDto {

  static final String SCHEMA_NAME = "ScreeningExaminationResult";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
