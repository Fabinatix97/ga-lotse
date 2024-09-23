/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterPhysiciansRecommendation(
    Boolean concernsCanChild,
    Boolean specialPromotion,
    Boolean introductionInBFZ,
    Boolean promotionOutsideSchool,
    Boolean furtherMeasures,
    Boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended) {}
