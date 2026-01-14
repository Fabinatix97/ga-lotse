/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.feature;

import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetBaseFeatureTogglesResponse(
    @NotNull Set<BaseFeature> enabledNewFeatures, @NotNull Set<BaseFeature> disabledOldFeatures) {}
