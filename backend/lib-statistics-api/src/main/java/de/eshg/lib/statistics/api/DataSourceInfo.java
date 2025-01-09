/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record DataSourceInfo(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull DataSourceSensitivity sensitivity,
    @NotNull boolean canBeAnonymized,
    @NotNull @Valid List<Attribute> attributes) {}
