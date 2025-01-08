/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "Packlist")
public record PacklistDto(
    @NotNull UUID id,
    @NotNull UUID revisionId,
    @Valid @NotNull List<PacklistElementDto> elements) {}
