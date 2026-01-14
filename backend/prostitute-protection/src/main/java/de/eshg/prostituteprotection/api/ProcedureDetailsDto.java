/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProcedureDetails")
public record ProcedureDetailsDto(
    @NotNull UUID id,
    @NotNull long version,
    String alias,
    @Valid AppointmentDto appointment,
    @NotNull boolean appointmentFromAppointmentBlock,
    @NotNull List<LanguageDto> languages,
    ConsultationTypeDto consultationType,
    @NotNull ProcedureStatusDto procedureStatus,
    CountryCode nationality,
    DocumentTypeDto documentTypeDto,
    Instant consultationCertificateCreatedAt,
    @Valid UserNameDto consultant,
    @Valid UserNameDto creator) {}
