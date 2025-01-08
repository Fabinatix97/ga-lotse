/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record GeoShapeMetaInfo(
    @NotNull UUID id,
    @NotBlank String title,
    @NotNull GeoShapeStatusDto status,
    @NotNull Instant createdAt) {}
