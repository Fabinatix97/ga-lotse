/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
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
    @CanBeLogged @NotNull BusinessModule businessModule,
    @CanBeLogged @NotNull ProcedureTypeDto procedureType,
    @CanBeLogged @NotNull Instant createdAt,
    @CanBeLogged @NotNull Instant modifiedAt,
    @CanBeLogged Instant closedAt,
    @CanBeLogged Instant exportedAt,
    @CanBeLogged @NotNull ProcedureStatusDto procedureStatus,
    @NotNull UUID procedureId,
    @Pattern(regexp = "[a-zA-Z0-9.].+") @Size(max = 128) @NotEmpty String summary,
    @Valid @NotNull ArchivingRelevanceSettingsDto archivingRelevanceSettings)
    implements AbstractProcedureDto {}
