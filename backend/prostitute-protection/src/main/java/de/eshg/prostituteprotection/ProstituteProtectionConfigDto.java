/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.config.api.MultiLangDocumentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ProstituteProtectionConfig")
public record ProstituteProtectionConfigDto(
    @NotNull @Valid MultiLangDocumentDto landingPageContent,
    @NotNull boolean onlinePortalBookingEnabled) {}
