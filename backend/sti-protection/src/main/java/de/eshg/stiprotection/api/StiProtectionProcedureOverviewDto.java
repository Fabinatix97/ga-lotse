/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.Year;
import java.util.UUID;

@Schema(name = "StiProtectionProcedureOverview")
public record StiProtectionProcedureOverviewDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    @NotNull ProcedureStatusDto status,
    @NotNull ConcernDto concern,
    @Schema(type = "integer") @NotNull Year yearOfBirth,
    @NotNull GenderDto gender,
    @NotNull @Valid AppointmentDto appointment) {}
