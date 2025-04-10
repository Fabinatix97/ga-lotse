/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "StiProtectionProcedure")
public record GetProcedureResponse(
    @Schema(description = "An unique identifier for the STI protection procedure.") @NotNull
        UUID id,
    @Schema(description = "The timestamp indicating when the procedure was created.") @NotNull
        Instant createdAt,
    @Schema(description = "The current status of the procedure.", example = "OPEN") @NotNull
        ProcedureStatusDto status,
    @NotNull ConcernDto concern,
    @Schema(description = "Specifies whether the procedure is a follow-up procedure.") @NotNull
        Boolean isFollowUp,
    @NotNull @Valid PersonDto person,
    @Valid AppointmentDto appointment,
    @NotNull @Valid List<AppointmentHistoryEntryDto> appointmentHistory,
    @Valid WaitingRoomDto waitingRoom,
    @NotNull LabStatusDto labStatus,
    @Schema(
            description = "Barcode for tracking the results with the external laboratory.",
            example = "Lab-586172")
        String sampleBarCode) {}
