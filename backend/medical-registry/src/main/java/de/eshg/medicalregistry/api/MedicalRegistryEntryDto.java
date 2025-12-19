/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "MedicalRegistryEntry")
public record MedicalRegistryEntryDto(
    @NotNull UUID id,
    @NotEmpty String lastName,
    @NotEmpty String firstName,
    ProfessionalTitleDto professionalTitle,
    @NotNull LocalDate dateOfBirth,
    @NotNull @Valid ApplicantAddressDto address,
    @NotNull boolean certificateRequested,
    @NotNull ProcedureStatusDto status,
    @NotNull ProcedureTypeDto type,
    @NotNull Instant createdAt) {}
