/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;

public record CreateSchoolInfoLetterRequest(
    String note,
    @NotNull Boolean consultationWithCustodianRecommended,
    @NotNull Boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended,
    String parentsWishNote,
    @NotNull Boolean referredToFurtherConsultationFromSchool) {}
