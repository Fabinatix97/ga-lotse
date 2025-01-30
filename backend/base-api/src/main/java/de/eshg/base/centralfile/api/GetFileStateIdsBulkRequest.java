/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public record GetFileStateIdsBulkRequest(
    @Schema(description = "A list of UUIDs to find associated file state ids for") @NotEmpty
        List<UUID> fileStateIds) {}
