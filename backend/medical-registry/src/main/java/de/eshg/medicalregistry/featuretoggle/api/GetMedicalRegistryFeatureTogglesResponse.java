/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.featuretoggle.api;

import de.eshg.medicalregistry.featuretoggle.MedicalRegistryFeature;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetMedicalRegistryFeatureTogglesResponse(
    @NotNull Set<MedicalRegistryFeature> enabledNewFeatures,
    @NotNull Set<MedicalRegistryFeature> disabledOldFeatures) {}
