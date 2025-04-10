/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;

public record CreateSchoolInfoLetterRequest(
    @NotNull boolean prefilled,
    String note,
    @NotNull Boolean consultationWithCustodianRecommended,
    @NotNull Boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
    String parentsWishNote,
    @NotNull Boolean referredToFurtherConsultationFromSchool) {
  public CreateSchoolInfoLetterRequest(
      String note,
      Boolean consultationWithCustodianRecommended,
      Boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
      String parentsWishNote,
      Boolean referredToFurtherConsultationFromSchool) {
    this(
        true,
        note,
        consultationWithCustodianRecommended,
        meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
        parentsWishNote,
        referredToFurtherConsultationFromSchool);
  }
}
