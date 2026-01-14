/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetFileStateIdsBulkResponse(
    @Schema(description = "A map of UUIDs to lists of the associated file state ids")
        @NotEmpty
        @Valid
        Map<UUID, @NotNull List<UUID>> fileStateIds) {}
