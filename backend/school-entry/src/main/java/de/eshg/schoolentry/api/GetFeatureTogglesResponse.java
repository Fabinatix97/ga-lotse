/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.schoolentry.config.SchoolEntryFeature;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "GetSchoolEntryFeatureTogglesResponse")
public record GetFeatureTogglesResponse(
    @NotNull Set<SchoolEntryFeature> enabledNewFeatures,
    @NotNull Set<SchoolEntryFeature> disabledOldFeatures) {}
