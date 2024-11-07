/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "MedicalRegistryEntry")
public record MedicalRegistryEntryDto(
    @NotNull UUID id,
    @NotEmpty String lastName,
    @NotEmpty String firstName,
    @NotNull LocalDate dateOfBirth,
    @NotNull @Valid ProfessionalAddressDto address,
    @NotNull boolean certificateRequested,
    @NotNull ProcedureStatusDto status,
    @NotNull ProcedureTypeDto type) {}
