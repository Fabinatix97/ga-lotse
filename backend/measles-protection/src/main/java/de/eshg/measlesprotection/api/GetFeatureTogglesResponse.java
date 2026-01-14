/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.measlesprotection.config.MeaslesProtectionFeature;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "GetMeaslesProtectionFeatureTogglesResponse")
public record GetFeatureTogglesResponse(
    @NotNull Set<MeaslesProtectionFeature> enabledNewFeatures,
    @NotNull Set<MeaslesProtectionFeature> disabledOldFeatures) {}
