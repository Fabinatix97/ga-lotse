/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateProcedureRequest(
    @NotNull TypeOfChangeDto typeOfChange,
    @NotNull @Valid CreateProfessionalDto professional,
    @Valid CreatePracticeDto practice,
    @NotNull boolean employeesEmployed,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation) {}
