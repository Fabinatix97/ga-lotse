/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenauth.api;

import de.eshg.officialmedicalservice.appointment.api.OmsAppointmentDto;
import de.eshg.officialmedicalservice.document.api.DocumentDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernDto;
import de.eshg.officialmedicalservice.procedure.api.MedicalOpinionStatusDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record GetCitizenProcedureDetailsResponse(
    @NotNull UUID procedureId,
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotNull LocalDate dateOfBirth,
    @Valid OmsAppointmentDto appointment,
    @NotNull @Valid ConcernDto concern,
    @NotNull @Valid List<DocumentDto> documents,
    @NotNull MedicalOpinionStatusDto medicalOpinionStatus,
    @NotNull boolean isAnamnesisAnswered,
    @NotNull boolean isAnamnesisEnabled) {}
