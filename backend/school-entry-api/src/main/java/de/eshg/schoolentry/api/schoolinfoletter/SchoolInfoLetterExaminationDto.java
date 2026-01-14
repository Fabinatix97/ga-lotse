/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterExamination")
public record SchoolInfoLetterExaminationDto(
    @NotNull @Valid SchoolInfoLetterChild child,
    @NotBlank String schoolYear,
    @NotBlank String date,
    @NotNull SchoolInfoLetterExaminationTypeDto type,
    @NotNull boolean postponed,
    @NotNull @Valid SchoolInfoLetterSchoolAndPromotionHintsDto schoolAndPromotionHints,
    String note,
    String customRecommendation,
    @NotNull @Valid SchoolInfoLetterVaccinationInfoDto vaccinationInfo,
    @NotNull @Valid SchoolInfoLetterEyeExaminationInfoDto eyeExaminationInfo,
    @NotNull @Valid SchoolInfoLetterHearingExaminationInfoDto hearingExaminationInfo,
    @NotNull boolean consultationWithCustodianRecommended,
    @NotNull @Valid SchoolInfoLetterTherapyAndPromotionInfoDto therapyAndPromotionInfo,
    @NotNull @Valid SchoolInfoLetterPhysiciansRecommendationDto physiciansRecommendation,
    @NotNull @Valid SchoolInfoLetterParentsWishDto parentsWish) {}
