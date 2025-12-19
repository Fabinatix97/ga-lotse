/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = AbsenceExaminationResultDto.SCHEMA_NAME)
public record AbsenceExaminationResultDto(@NotNull ReasonForAbsenceDto reasonForAbsence)
    implements ExaminationResultDto {

  static final String SCHEMA_NAME = "AbsenceExaminationResult";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
