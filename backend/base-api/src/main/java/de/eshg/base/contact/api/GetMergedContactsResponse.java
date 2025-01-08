/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetMergedContactsResponse(
    @Schema(description = "List of contact IDs that have been merged into the requested contact")
        @NotNull
        List<UUID> contactIds) {}
