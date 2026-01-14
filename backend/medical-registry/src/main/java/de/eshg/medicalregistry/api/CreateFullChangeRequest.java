/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateFullChangeRequest(
    @NotNull TypeOfFullChangeDto typeOfFullChange,
    @NotNull @Valid CreateApplicantDto applicant,
    @NotNull @Valid CreateProfessionInformationDto professionInformation,
    @Valid CreatePracticeDto practice,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation)
    implements CreateProcedureRequest {}
