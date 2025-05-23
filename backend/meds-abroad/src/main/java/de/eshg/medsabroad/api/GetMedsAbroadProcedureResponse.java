/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "MedsAbroadProcedure")
public record GetMedsAbroadProcedureResponse(
    @Schema(description = "An unique identifier for the meds abroad procedure.") @NotNull UUID id,
    @Schema(description = "The timestamp indicating when the procedure was created.") @NotNull
        Instant createdAt,
    @NotNull @Valid PersonDto person,
    Instant appointmentStart,
    @NotNull Boolean certificatePaid,
    @Schema(description = "The current status of the procedure.", example = "OPEN") @NotNull
        ProcedureStatusDto procedureStatus) {}
