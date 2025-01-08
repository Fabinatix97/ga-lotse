/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "GeoShape")
public record GeoShapeDto(
    @NotNull UUID id,
    @NotBlank String title,
    @NotNull GeoShapeStatusDto status,
    @NotNull Instant createdAt,
    @NotBlank String geoJson) {}
