/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspectionSampleMeasurementParameter")
public record InspectionSampleMeasurementParameterDto(
    @NotNull UUID externalId,
    @NotNull String parameterName,
    String parameterGroup,
    Double measurementValue,
    String unit,
    @NotNull InspectionSamplePreclassificationDto preclassification,
    String userAssessment) {}
