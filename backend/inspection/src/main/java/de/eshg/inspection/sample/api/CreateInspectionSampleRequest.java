/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "CreateInspectionSampleRequest")
public record CreateInspectionSampleRequest(
    @NotNull UUID externalId,
    @NotNull InspectionSampleTypeDto typeOfSample,
    @NotNull String pointOfWithdrawal,
    String nameOfSamplingPoint,
    @NotNull InspectionSampleEvaluationTypeDto evaluationType,
    @NotNull @Valid InspectionSampleActorReferenceDto samplingActor,
    Instant timeOfSampling,
    @NotNull @Valid InspectionSampleActorReferenceDto evaluatingActor,
    Instant timeOfEvaluation,
    @NotNull @NotEmpty @Valid
        List<@Valid CreateInspectionSampleMeasurementParameterRequest> measurementParameters) {}
