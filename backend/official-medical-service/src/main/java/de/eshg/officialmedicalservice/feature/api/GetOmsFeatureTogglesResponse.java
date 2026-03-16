/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.feature.api;

import de.eshg.officialmedicalservice.feature.OmsFeature;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetOmsFeatureTogglesResponse(
    @NotNull Set<OmsFeature> enabledNewFeatures, @NotNull Set<OmsFeature> disabledOldFeatures) {}
