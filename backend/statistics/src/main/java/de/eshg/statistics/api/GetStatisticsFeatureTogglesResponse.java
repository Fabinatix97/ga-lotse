/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.config.StatisticsFeature;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "GetStatisticsFeatureTogglesResponse")
public record GetStatisticsFeatureTogglesResponse(
    @NotNull Set<StatisticsFeature> enabledNewFeatures,
    @NotNull Set<StatisticsFeature> disabledOldFeatures) {}
