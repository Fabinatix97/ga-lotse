/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Schema(name = "Measurements", description = "Body measurement results of the examination.")
public record MeasurementsDto(
    @Schema(description = "Height of the child in cm.") Integer height,
    @Schema(description = "Weight of the child in kg.") Double weight,
    @Min(1) @Max(999) @Schema(description = "Systolic blood pressure of the child in mmHg.")
        Integer systole,
    @Min(1) @Max(999) @Schema(description = "Diastolic blood pressure of the child in mmHg.")
        Integer diastole) {
  public MeasurementsDto() {
    this(null, null, null, null);
  }
}
