/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterPhysiciansRecommendation")
public record SchoolInfoLetterPhysiciansRecommendationDto(
    @NotNull boolean concernsCanChild,
    @NotNull boolean specialPromotion,
    @NotNull boolean introductionInBFZ,
    @NotNull boolean promotionOutsideSchool,
    @NotNull boolean furtherMeasures,
    @NotNull boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended) {}
