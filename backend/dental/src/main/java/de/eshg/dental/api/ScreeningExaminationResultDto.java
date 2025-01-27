/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = ScreeningExaminationResultDto.SCHEMA_NAME)
public record ScreeningExaminationResultDto(
    @NotNull boolean fluorideVarnishApplied,
    OralHygieneStatusDto oralHygieneStatus,
    @NotNull @Valid List<ToothDiagnosisDto> toothDiagnoses)
    implements ExaminationResultDto {

  static final String SCHEMA_NAME = "ScreeningExaminationResult";

  public ScreeningExaminationResultDto(
      boolean fluorideVarnishApplied, OralHygieneStatusDto oralHygieneStatus) {
    this(fluorideVarnishApplied, oralHygieneStatus, List.of());
  }

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
