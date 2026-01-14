/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "ProgressEntryReferenceFilePair")
public record ProgressEntryReferenceFilePairDto(
    @NotNull UUID progressEntryId, @NotNull @Valid AbstractFileDto file) {}
