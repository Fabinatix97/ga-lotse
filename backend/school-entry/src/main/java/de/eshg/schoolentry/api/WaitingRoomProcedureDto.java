/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "WaitingRoomProcedure")
public record WaitingRoomProcedureDto(
    @NotNull UUID id,
    @NotNull @Valid ChildDto child,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    @NotNull Instant modifiedAt)
    implements ProcedureBaseDto {}
