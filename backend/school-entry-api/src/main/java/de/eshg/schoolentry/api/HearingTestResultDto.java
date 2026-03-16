/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Schema(name = "HearingTestResult")
public record HearingTestResultDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @Valid
        @NotNull
        @Schema(
            description = "Examination results of the left ear. Expected keys: HertzValue values",
            example =
                """
                    {
                      "250" : "20",
                      "500" : "30",
                      "1000" : "40",
                      "2000" : "50",
                      "4000" : "60",
                      "6000" : null,
                      "8000" : null
                    }
                    """)
        Map<HertzValueDto, DecibelValueDto> leftEar,
    @Valid
        @NotNull
        @Schema(
            description = "Examination results of the right ear. Expected keys: HertzValue values",
            example =
                """
                    {
                      "250" : "null",
                      "500" : "null",
                      "1000" : "30",
                      "2000" : "40",
                      "4000" : "50",
                      "6000" : "60",
                      "8000" : "60"
                    }
                    """)
        Map<HertzValueDto, DecibelValueDto> rightEar,
    @Valid @NotNull ExaminationResultDto examinationResult,
    @Schema(description = "Notes recorded for the hearing test.") String note,
    @Schema(description = "Data of pending measurement on a device.") @Valid
        PendingMeasurementDto pendingMeasurement) {}
