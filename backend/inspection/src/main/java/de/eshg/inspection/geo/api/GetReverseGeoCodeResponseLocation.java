/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.geo.api;

import jakarta.validation.constraints.NotNull;

public record GetReverseGeoCodeResponseLocation(
    @NotNull String latitude, @NotNull String longitude) {}
