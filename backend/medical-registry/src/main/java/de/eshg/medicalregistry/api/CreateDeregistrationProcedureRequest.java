/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateDeregistrationProcedureRequest(
    @NotNull TypeOfDeRegistrationDto typeOfDeRegistration,
    @Valid @NotNull CreateApplicantDto applicant,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation)
    implements CreateProcedureRequest {}
