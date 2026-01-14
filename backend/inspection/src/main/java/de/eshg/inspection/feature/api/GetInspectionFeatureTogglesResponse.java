/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.feature.api;

import de.eshg.inspection.feature.InspectionFeature;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "GetInspectionFeatureTogglesResponse")
public record GetInspectionFeatureTogglesResponse(
    @NotNull Set<InspectionFeature> enabledNewFeatures,
    @NotNull Set<InspectionFeature> disabledOldFeatures) {}
