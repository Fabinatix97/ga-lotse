/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PutOmsConfigRequest(
    @NotNull @PositiveOrZero Integer keycloakUserCleanupJobOverdueDuration,
    @NotNull @PositiveOrZero Integer medicalOpinionCutOffDateLeadTime,
    @NotNull Boolean citizenPortalAnamnesisEnabled,
    Boolean deleteLandingPageEn,
    Boolean deleteSelectConcernInfoboxDe,
    Boolean deleteSelectConcernInfoboxEn) {}
