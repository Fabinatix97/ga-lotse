/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record GetConfigurationStatusResponse(
    @Valid @NotEmpty Map<@NotNull String, @NotNull ConfigurationStatusDto> endpointStates,
    @NotNull ConfigurationStatusDto moduleState) {}
