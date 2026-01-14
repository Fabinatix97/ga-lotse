/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;

@Schema(name = "HandicapWithDiagnosis")
public record HandicapWithDiagnosisDto(
    @Schema(description = "If the value is true, there is a handicap.") Boolean result,
    @Schema(description = "List of ICD-10 codes to document the handicap.") @Valid
        List<Icd10CodeWithOriginalCodeDto> icd10Codes) {
  public HandicapWithDiagnosisDto() {
    this(null, List.of());
  }
}
