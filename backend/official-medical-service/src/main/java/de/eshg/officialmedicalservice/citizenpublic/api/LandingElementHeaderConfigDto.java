/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "LandingElementHeaderConfig")
public record LandingElementHeaderConfigDto(@NotBlank String de, @NotBlank String en) {}
