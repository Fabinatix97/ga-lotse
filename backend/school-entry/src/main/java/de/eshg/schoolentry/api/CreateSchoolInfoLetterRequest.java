/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;

public record CreateSchoolInfoLetterRequest(
    @NotNull boolean prefilled,
    String note,
    String customRecommendation,
    @NotNull boolean consultationWithCustodianRecommended,
    @NotNull boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
    String parentsWishNote,
    @NotNull boolean referredToFurtherConsultationFromSchool) {
  public CreateSchoolInfoLetterRequest(
      String note,
      String customRecommendation,
      boolean consultationWithCustodianRecommended,
      boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
      String parentsWishNote,
      boolean referredToFurtherConsultationFromSchool) {
    this(
        true,
        note,
        customRecommendation,
        consultationWithCustodianRecommended,
        meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
        parentsWishNote,
        referredToFurtherConsultationFromSchool);
  }
}
