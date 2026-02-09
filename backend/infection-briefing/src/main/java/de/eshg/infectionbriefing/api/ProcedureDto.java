/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "Procedure")
public record ProcedureDto(
    @NotNull UUID procedureId,
    @NotBlank String lastName,
    @NotBlank String firstName,
    @NotNull LocalDate dateOfBirth,
    @NotNull ProcedureStatusDto status,
    @NotNull ProcedureTypeDto procedureType,
    Instant appointmentStart,
    Instant appointmentEnd) {}
