/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import de.eshg.opendata.config.OpenDataFeature;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "GetOpenDataFeatureTogglesResponse")
public record GetFeatureTogglesResponse(
    @NotNull Set<OpenDataFeature> enabledNewFeatures,
    @NotNull Set<OpenDataFeature> disabledOldFeatures) {}
