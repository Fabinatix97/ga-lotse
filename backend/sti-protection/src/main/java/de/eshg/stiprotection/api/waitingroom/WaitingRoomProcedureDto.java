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
    String accessCode,
    @NotNull Year yearOfBirth,
    @NotNull Gender gender,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    @NotNull Instant modifiedAt) {}
