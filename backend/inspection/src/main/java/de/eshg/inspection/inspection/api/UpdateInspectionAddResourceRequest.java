/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

/**
 * Request to add a resource item to an inspection.
 *
 * @param resourceId the id of the resource
 * @param start start time for the resource booking
 * @param end end time for the resource booking
 */
@Schema(name = "UpdateInspectionAddResourceRequest")
public record UpdateInspectionAddResourceRequest(
    @NotNull UUID resourceId, @NotNull Instant start, @NotNull Instant end) {}
