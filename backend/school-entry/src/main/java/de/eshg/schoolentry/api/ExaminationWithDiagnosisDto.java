/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "ExaminationWithDiagnosis")
public record ExaminationWithDiagnosisDto(
    @Valid @NotNull ExaminationResultDto examinationResult,
    @Schema(
            description = "List of ICD-10 codes to document the examination result.",
            example = "[\"A00\", \"C00\"]")
        List<String> icd10Codes) {
  public ExaminationWithDiagnosisDto() {
    this(new ExaminationResultDto(), List.of());
  }
}
