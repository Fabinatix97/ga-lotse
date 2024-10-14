/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record DataSourceWithAttributeNames(
    @NotBlank String businessModuleName,
    @NotNull UUID id,
    @NotNull @Size(min = 1) @Valid List<BusinessDataAttributeWithName> dataAttributes) {}
