/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record BusinessDataSourceAttribute(
    @NotBlank String name,
    @NotBlank String code,
    @NotBlank String category,
    @Valid List<BaseDataSourceAttribute> baseAttributes) {}
