/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "GetDevelopmentScreeningResult")
public record GetDevelopmentScreeningResultDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @Valid @NotNull MeasurementsDto measurements,
    @Valid @NotNull PercentilesDto percentiles,
    @Valid @NotNull PhysicalExaminationDto physicalExamination,
    @Valid @NotNull HandicapDto handicap,
    @Valid @NotNull PsychoSocialRiskDto psychoSocialRisk,
    @Valid @NotNull SocioEducationalPerformanceDto socioEducationalPerformance,
    @Schema(
            description =
                "If true, then the examination of the child represented an additional effort.")
        Boolean extraEffort,
    SchoolRecommendationDto schoolRecommendation,
    SchoolFeedbackDto schoolFeedback) {}
