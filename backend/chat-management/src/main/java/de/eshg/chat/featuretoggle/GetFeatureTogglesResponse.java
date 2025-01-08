/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.featuretoggle;

import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetFeatureTogglesResponse(
    @NotNull Set<ChatFeature> enabledNewFeatures, @NotNull Set<ChatFeature> disabledOldFeatures) {}
