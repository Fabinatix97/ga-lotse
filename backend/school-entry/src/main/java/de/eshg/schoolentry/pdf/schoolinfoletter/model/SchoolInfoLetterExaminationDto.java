/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/*
 * @TODO  when blank letter possibility was removed:
 *   type & all @Valid objects can be annotated @NotNull
 */

@Schema(name = "SchoolInfoLetterExamination")
public record SchoolInfoLetterExaminationDto(
    @NotNull @Valid SchoolInfoLetterChild child,
    @NotBlank String schoolYear,
    @NotBlank String date,
    SchoolInfoLetterExaminationTypeDto type,
    @NotNull boolean postponed,
    @Valid SchoolInfoLetterSchoolAndPromotionHintsDto schoolAndPromotionHints,
    String note,
    String customRecommendation,
    @Valid SchoolInfoLetterVaccinationInfoDto vaccinationInfo,
    @Valid SchoolInfoLetterEyeExaminationInfoDto eyeExaminationInfo,
    @Valid SchoolInfoLetterHearingExaminationInfoDto hearingExaminationInfo,
    @NotNull boolean consultationWithCustodianRecommended,
    @Valid SchoolInfoLetterTherapyAndPromotionInfoDto therapyAndPromotionInfo,
    @Valid SchoolInfoLetterPhysiciansRecommendationDto physiciansRecommendation,
    @Valid SchoolInfoLetterParentsWishDto parentsWish) {}
