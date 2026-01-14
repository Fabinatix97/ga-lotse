/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "ExaminationWithDiagnosis")
public record ExaminationWithDiagnosisDto(
    @Valid @NotNull ExaminationResultDto examinationResult,
    @Schema(description = "List of ICD-10 codes to document the examination result.") @Valid
        List<Icd10CodeWithOriginalCodeDto> icd10Codes) {
  public ExaminationWithDiagnosisDto() {
    this(new ExaminationResultDto(), List.of());
  }
}
