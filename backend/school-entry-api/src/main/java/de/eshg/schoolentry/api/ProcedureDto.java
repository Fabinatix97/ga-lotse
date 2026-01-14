/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
    @NotNull long version,
    @NotNull ProcedureTypeDto type,
    @NotNull @Valid ChildDto child,
    @NotNull ProcedureStatusDto status,
    @Valid SchoolDto school,
    Integer schoolYear,
    @NotNull @Valid List<ProcedureLabelDto> labels,
    Instant appointmentStart,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt)
    implements ProcedureBaseDto {}
