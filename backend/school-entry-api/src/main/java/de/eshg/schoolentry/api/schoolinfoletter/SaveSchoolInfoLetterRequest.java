/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record SaveSchoolInfoLetterRequest(
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
