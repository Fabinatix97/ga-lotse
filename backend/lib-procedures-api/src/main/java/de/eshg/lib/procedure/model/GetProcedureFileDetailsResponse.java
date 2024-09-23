/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetProcedureFileDetailsResponse(
    @NotNull UUID procedureId,
    @NotNull @Valid List<ProgressEntryReferenceFilePairDto> fileDetails) {}
