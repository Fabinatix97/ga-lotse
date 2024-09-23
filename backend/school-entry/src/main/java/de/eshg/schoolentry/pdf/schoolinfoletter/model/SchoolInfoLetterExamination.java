/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterExamination(
    SchoolInfoLetterChild child,
    String schoolYear,
    String date,
    SchoolInfoLetterExaminationType type,
    SchoolInfoLetterSchoolAndPromotionHints schoolAndPromotionHints,
    String note,
    SchoolInfoLetterVaccinationInfo vaccinationInfo,
    SchoolInfoLetterEyeExaminationInfo eyeExaminationInfo,
    SchoolInfoLetterHearingExaminationInfo hearingExaminationInfo,
    Boolean consultationWithCustodianRecommended,
    SchoolInfoLetterTherapyAndPromotionInfo therapyAndPromotionInfo,
    SchoolInfoLetterPhysiciansRecommendation schoolInfoLetterPhysiciansRecommendation,
    SchoolInfoLetterParentsWish parentsWish) {}
