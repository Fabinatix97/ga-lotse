/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGeoShapesResponse(
    @NotNull @Valid List<GeoShapeMetaInfo> geoShapeMetaInfos,
    @NotNull @Min(0) long totalNumberOfElements) {}
