/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ToothDiagnosis")
public record ToothDiagnosisDto(
    @NotNull ToothDto tooth, MainResultDto mainResult, SecondaryResultDto secondaryResult) {

  public ToothDiagnosisDto(ToothDto tooth) {
    this(tooth, null, null);
  }

  public ToothDiagnosisDto(ToothDto tooth, MainResultDto mainResult) {
    this(tooth, mainResult, null);
  }
}
