/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "MedsAbroadProcedure", description = "Represents a procedure for the applicant.")
public record MedsAbroadProcedureDto(
    @NotNull UUID id,
    @NotNull @PastOrPresent Instant createdAt,
    @NotNull @Valid PersonDto person,
    Instant appointmentStart,
    @NotNull Boolean certificatePaid,
    @NotNull ProcedureStatusDto procedureStatus) {}
