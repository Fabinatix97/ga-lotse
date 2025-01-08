/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateApplicantChangeRequest(
    @NotNull TypeOfApplicantChangeDto typeOfApplicantChange,
    @Valid @NotNull CreateApplicantDto applicant,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation)
    implements CreateProcedureRequest {}
