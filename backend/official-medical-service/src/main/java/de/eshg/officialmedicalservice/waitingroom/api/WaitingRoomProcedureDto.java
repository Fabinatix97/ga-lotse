/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "WaitingRoomProcedure")
public record WaitingRoomProcedureDto(
    @NotNull UUID id,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull LocalDate dateOfBirth,
    @NotNull String facilityName,
    String physicianName,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    @NotNull Instant modifiedAt) {}
