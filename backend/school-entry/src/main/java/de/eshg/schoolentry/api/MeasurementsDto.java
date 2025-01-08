/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;

@Schema(name = "Measurements", description = "Body measurement results of the examination.")
public record MeasurementsDto(
    @Schema(description = "Height of the child in m.") Double height,
    @Schema(description = "Weight of the child in kg.") Double weight,
    @Min(0) @Schema(description = "Systolic blood pressure of the child in mmHg.") Integer systole,
    @Min(0) @Schema(description = "Diastolic blood pressure of the child in mmHg.")
        Integer diastole) {
  public MeasurementsDto() {
    this(null, null, null, null);
  }
}
