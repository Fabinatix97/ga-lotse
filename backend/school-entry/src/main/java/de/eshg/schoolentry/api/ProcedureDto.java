/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "SchoolEntryProcedure")
public record ProcedureDto(
    @NotNull UUID id,
    @NotNull ProcedureTypeDto type,
    @NotNull @Valid ChildDto child,
    @NotNull ProcedureStatusDto status,
    @Valid SchoolDto school,
    Integer schoolYear,
    @NotNull @Valid List<LabelDto> labels,
    Instant appointmentStart,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt)
    implements ProcedureBaseDto {}
