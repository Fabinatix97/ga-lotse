/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "LandingElementConfig")
public record LandingElementConfigDto(
    @NotNull @Valid LandingElementHeaderConfigDto elementHeader,
    @Valid LandingElementListConfigDto elementList) {}
