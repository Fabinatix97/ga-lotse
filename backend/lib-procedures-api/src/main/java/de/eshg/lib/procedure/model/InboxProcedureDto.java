/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InboxProcedure")
public record InboxProcedureDto(
    @NotNull UUID inboxProcedureId,
    ProcedureTypeDto inboxProcedureType,
    @NotNull InboxProcedureStatusDto inboxProcedureStatus,
    @NotNull UUID createdBy,
    @NotNull Instant createdAt,
    Instant closedAt,
    @Valid @NotNull InboxProgressEntryDto inboxProgressEntry,
    @Valid @NotNull ContactDetailsDto contactDetails) {}
