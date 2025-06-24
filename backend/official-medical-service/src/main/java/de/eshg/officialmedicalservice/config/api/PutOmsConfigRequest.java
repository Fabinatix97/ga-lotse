/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PutOmsConfigRequest(
    @NotNull @PositiveOrZero Integer keycloakUserCleanupJobOverdueDuration,
    @NotNull @PositiveOrZero Integer medicalOpinionCutOffDateLeadTime,
    @NotNull Boolean citizenPortalAnamnesisEnabled,
    Boolean deleteLandingPageEn) {}
