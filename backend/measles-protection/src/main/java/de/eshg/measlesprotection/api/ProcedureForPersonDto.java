/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ProcedureForPerson")
public record ProcedureForPersonDto(
    @NotNull UUID externalId,
    @NotNull LocalDate reportingDate,
    @NotNull ProcedureStatusDto procedureStatus,
    ReportingReasonDto reportingReason) {}
