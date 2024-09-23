/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(name = "WebSearchRequest")
public record WebSearchRequest(
    @NotBlank String name,
    @NotBlank @Pattern(regexp = "^https?://.*$", message = "no valid url") String basicURL,
    @NotBlank String searchCity) {}
