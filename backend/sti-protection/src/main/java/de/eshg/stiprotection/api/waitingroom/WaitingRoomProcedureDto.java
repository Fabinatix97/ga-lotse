/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.waitingroom;

import de.eshg.stiprotection.persistence.db.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.Year;
import java.util.UUID;

@Schema(name = "WaitingRoomProcedure")
public record WaitingRoomProcedureDto(
    @NotNull UUID procedureId,
    @Schema(description = "Unique code for patient identification", example = "h28RQNDRXoffRMzqM")
        String accessCode,
    @Schema(description = "Indicates the year of birth of the person.", example = "1996") @NotNull
        Year yearOfBirth,
    @NotNull Gender gender,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    @Schema(
            description =
                "Timestamp indicating when the last status change occurred for the procedure.")
        @NotNull
        Instant modifiedAt) {}
