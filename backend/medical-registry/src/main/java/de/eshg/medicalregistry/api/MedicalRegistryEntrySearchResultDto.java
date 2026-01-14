/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.AbstractProcedureDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "MedicalRegistryEntrySearchResult")
public record MedicalRegistryEntrySearchResultDto(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull Instant created,
    @NotNull Instant modifiedAt,
    @NotNull ProcedureStatusDto status,
    @NotNull List<String> practiceNames)
    implements AbstractProcedureDto {}
