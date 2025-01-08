/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record BusinessDataAttributeWithName(
    @NotBlank String code,
    @NotBlank String name,
    @NotNull @Valid List<BaseDataAttributeWithName> baseDataAttributes) {}
