/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.evaluationtemplate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record RepoDataSource(
    @NotBlank String businessModuleName,
    @NotNull UUID dataSourceId,
    @NotBlank String dataSourceName,
    @NotNull @Size(min = 1) @Valid List<RepoBusinessDataAttribute> dataAttributes) {}
