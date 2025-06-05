/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateEmployeeChangeRequest(
    @Valid @NotNull CreateApplicantDto applicant,
    @Valid @NotNull List<@NotNull @Valid CreateEmployeeChangeDto> employeeChanges,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation)
    implements CreateProcedureRequest {}
