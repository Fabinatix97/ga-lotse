/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.validation.constraints.DateOfBirth;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ProstituteProtectionProcedureSearchOverview")
public record ProstituteProtectionProcedureSearchOverviewDto(
    @NotNull UUID id,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    String alias,
    @NotNull @DateOfBirth LocalDate dateOfBirth,
    String creatorName,
    String consultantName,
    ConsultationTypeDto consultationType,
    Instant appointmentStart,
    @NotNull ProcedureStatusDto status) {}
