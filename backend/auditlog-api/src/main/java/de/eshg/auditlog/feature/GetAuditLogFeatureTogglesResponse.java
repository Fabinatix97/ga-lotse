/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.feature;

import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetAuditLogFeatureTogglesResponse(
    @NotNull Set<AuditLogFeature> enabledNewFeatures,
    @NotNull Set<AuditLogFeature> disabledOldFeatures) {}
