/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "InspectionSample")
public record InspectionSampleDto(
    @NotNull UUID inspectionId,
    @NotNull UUID sampleId,
    @NotNull InspectionSampleTypeDto typeOfSample,
    @NotNull String pointOfWithdrawal,
    @NotNull String sampleNumber,
    @NotNull InspectionSampleEvaluationTypeDto evaluationType,
    @NotNull @Valid InspectionSampleActorDto samplingActor,
    Instant timeOfSampling,
    @NotNull @Valid InspectionSampleActorDto evaluatingActor,
    Instant timeOfEvaluation,
    String label,
    @NotNull Instant createdAt,
    @NotNull @Valid
        List<@NotNull @Valid InspectionSampleMeasurementParameterDto> measurementParameters) {}
