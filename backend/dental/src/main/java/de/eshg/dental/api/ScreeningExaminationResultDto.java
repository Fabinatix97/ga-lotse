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
    Boolean fluorideVarnishApplied,
    OralHygieneStatusDto oralHygieneStatus,
    @NotNull DentitionTypeDto dentitionType,
    @NotNull @Valid List<ToothDiagnosisDto> toothDiagnoses)
    implements ExaminationResultDto, IsFluorideVarnishApplicable {

  static final String SCHEMA_NAME = "ScreeningExaminationResult";

  public ScreeningExaminationResultDto(DentitionTypeDto dentitionType) {
    this(null, null, dentitionType, List.of());
  }

  public ScreeningExaminationResultDto(
      Boolean fluorideVarnishApplied,
      OralHygieneStatusDto oralHygieneStatus,
      DentitionTypeDto dentitionType) {
    this(fluorideVarnishApplied, oralHygieneStatus, dentitionType, List.of());
  }

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
