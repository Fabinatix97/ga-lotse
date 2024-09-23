/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Schema(name = "EyeExaminationResult")
public record EyeExaminationResultDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @Valid
        @NotNull
        @Schema(
            description =
                "Examination results for the left eye. Expected keys: EyeExaminationType values",
            example =
                """
                    {
                      "DISTANCE" : "PERCENTAGE_50",
                      "DISTANCE_PLUS_15DPT" : "PERCENTAGE_70",
                      "DISTANCE_WITH_GLASSES" : "PERCENTAGE_100"
                    }
                    """)
        Map<EyeExaminationTypeDto, PercentageValueDto> leftEye,
    @Valid
        @NotNull
        @Schema(
            description =
                "Examination results for the right eye. Expected keys: EyeExaminationType values",
            example =
                """
                    {
                      "DISTANCE" : "PERCENTAGE_50",
                      "DISTANCE_PLUS_15DPT" : "PERCENTAGE_70",
                      "DISTANCE_WITH_GLASSES" : "PERCENTAGE_100"
                    }
                    """)
        Map<EyeExaminationTypeDto, PercentageValueDto> rightEye,
    @Valid @NotNull ExaminationResultDto eyeExamination,
    @Valid @NotNull ExaminationResultDto langExamination,
    @Valid @NotNull ExaminationResultDto ishiharaExamination,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined an amblyopia during the examination.")
        boolean amblyopia,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined astigmatism during the examination.")
        boolean astigmatism,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined color vision disorder during the examination.")
        boolean colorVisionDisorder,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined hyperopia during the examination.")
        boolean hyperopia,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined myopia during the examination.")
        boolean myopia,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined strabismus during the examination.")
        boolean strabismus,
    @NotNull
        @Schema(
            description =
                "Can be set to true if doctorLetterValue of the eyeExamination is CONFIRMED OR PARTIALLY_CONFIRMED.\n If true, the doctor determined another diagnosis during the examination.")
        boolean otherDiagnosis,
    String note) {}
