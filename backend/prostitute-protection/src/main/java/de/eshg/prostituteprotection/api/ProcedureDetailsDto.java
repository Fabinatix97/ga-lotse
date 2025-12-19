/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.validation.constraints.DateOfBirth;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProcedureDetails")
public record ProcedureDetailsDto(
    @NotNull UUID id,
    @NotNull long version,
    @Size(min = 1, max = 80) String firstName,
    @Size(min = 1, max = 120) String lastName,
    @DateOfBirth LocalDate dateOfBirth,
    String alias,
    @Valid AppointmentDto appointment,
    @NotNull List<LanguageDto> languages,
    ConsultationTypeDto consultationType,
    @NotNull ProcedureStatusDto procedureStatus,
    CountryCode nationality,
    DocumentTypeDto documentTypeDto,
    Instant consultationCertificateCreatedAt) {}
