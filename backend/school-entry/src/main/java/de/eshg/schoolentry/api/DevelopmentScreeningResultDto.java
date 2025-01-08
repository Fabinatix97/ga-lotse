/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
