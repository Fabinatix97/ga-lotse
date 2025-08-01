/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config.api;

import jakarta.validation.constraints.NotNull;

public record PutInspectionPropertiesConfigurationRequest(
    @NotNull FacilityFileNumberMethodDto facilityFileNumberMethod) {}
