/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "GetMedicalRegistryProcedureResponse")
public record GetProcedureResponse(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull @Valid ProfessionalDto professional,
    @Valid PracticeDto practice,
    @NotNull boolean employeesEmployed,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation) {}
