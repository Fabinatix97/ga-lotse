/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "GetSchoolEntryFeatureTogglesResponse")
public record GetFeatureTogglesResponse(
    @NotNull Set<SchoolEntryFeature> enabledNewFeatures,
    @NotNull Set<SchoolEntryFeature> disabledOldFeatures) {}
