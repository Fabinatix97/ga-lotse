/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

@Valid
@Schema(name = "Procedure")
public record ProcedureDto(
    @NotNull BusinessModule businessModule,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt,
    Instant closedAt,
    Instant exportedAt,
    @NotNull ProcedureStatusDto procedureStatus,
    @NotNull UUID procedureId,
    @Pattern(regexp = "[a-zA-Z0-9.].+") @Size(max = 128) @NotEmpty String summary,
    @Valid @NotNull ArchivingRelevanceSettingsDto archivingRelevanceSettings)
    implements AbstractProcedureDto {}
