/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "DevelopmentScreeningResult")
public record DevelopmentScreeningResultDto(
    @NotNull long version,
    @Valid @NotNull MeasurementsDto measurements,
    @Valid @NotNull PhysicalExaminationDto physicalExamination,
    @Valid @NotNull HandicapDto handicap,
    @Valid @NotNull PsychoSocialRiskDto psychoSocialRisk,
    @Valid @NotNull SocioEducationalPerformanceDto socioEducationalPerformance,
    Boolean extraEffort,
    SchoolRecommendationDto schoolRecommendation,
    SchoolFeedbackDto schoolFeedback) {}
