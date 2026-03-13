/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "InspectionSampleTemplate")
public record InspectionSampleTemplateDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull InspectionSampleEvaluationTypeDto evaluationType,
    @NotNull InspectionSampleTypeDto typeOfSample,
    @NotNull @Valid
        List<@NotNull @Valid InspectionSampleMeasurementParameterTemplateDto>
            measurementParameters) {}
