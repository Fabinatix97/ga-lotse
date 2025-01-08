/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "HandicapWithDiagnosis")
public record HandicapWithDiagnosisDto(
    @Schema(description = "If the value is true, there is a handicap.") Boolean result,
    @Schema(
            description = "List of ICD-10 codes to document the handicap.",
            example = "[\"J00\", \"K00\"]")
        List<String> icd10Codes) {
  public HandicapWithDiagnosisDto() {
    this(null, List.of());
  }
}
