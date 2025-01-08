/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.featuretoggle.api;

import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetTravelMedicineFeatureTogglesResponse(
    @NotNull Set<TravelMedicineFeature> enabledNewFeatures,
    @NotNull Set<TravelMedicineFeature> disabledOldFeatures) {}
