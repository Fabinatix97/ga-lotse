/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProstituteProtectionProcedureOverview")
public record ProstituteProtectionProcedureOverviewDto(
    @NotNull UUID id,
    @NotNull long version,
    String alias,
    @NotNull List<LanguageDto> languages,
    ConsultationTypeDto consultationType,
    Instant appointmentStart,
    @NotNull ProcedureStatusDto status,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
