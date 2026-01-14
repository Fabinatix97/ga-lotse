/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

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
