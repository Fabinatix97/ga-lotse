/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config.api;

import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.api.MultiLangDocumentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Schema(name = "OmsConfig")
public record OmsConfigDto(
    @NotNull @Valid DocumentDetailsDto concerns,
    @NotNull @Valid MultiLangDocumentDto landingPageContent,
    @Valid MultiLangDocumentDto selectConcernInfobox,
    @NotNull @PositiveOrZero Integer keycloakUserCleanupJobOverdueDuration,
    @NotNull @PositiveOrZero Integer medicalOpinionCutOffDateLeadTime,
    @NotNull Boolean citizenPortalAnamnesisEnabled) {}
