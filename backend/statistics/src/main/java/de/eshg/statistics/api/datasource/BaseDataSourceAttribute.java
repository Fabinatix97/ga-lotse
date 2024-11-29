/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.datasource;

import jakarta.validation.constraints.NotBlank;

public record BaseDataSourceAttribute(
    @NotBlank String displayName, @NotBlank String name, @NotBlank String code) {}
