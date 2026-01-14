/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AffectedPersonSync")
public record AffectedPersonSyncDto(
    @NotNull UUID fileStateId, @NotNull long version, @NotNull boolean outdated) {}
