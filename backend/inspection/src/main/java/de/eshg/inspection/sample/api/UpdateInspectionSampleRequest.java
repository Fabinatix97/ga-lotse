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

@Schema(name = "UpdateInspectionSampleRequest")
public record UpdateInspectionSampleRequest(
    @NotNull InspectionSampleTypeDto typeOfSample,
    @NotNull String pointOfWithdrawal,
    @NotNull String sampleNumber,
    @NotNull InspectionSampleEvaluationTypeDto evaluationType,
    @NotNull @Valid InspectionSampleActorReferenceDto samplingActor,
    Instant timeOfSampling,
    @NotNull @Valid InspectionSampleActorReferenceDto evaluatingActor,
    Instant timeOfEvaluation,
    @NotNull List<UUID> measurementParametersToDelete,
    @NotNull @Valid
        List<@NotNull @Valid CreateInspectionSampleMeasurementParameterRequest>
            measurementParametersToAdd) {}
