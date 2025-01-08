/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.statistics.api.RepositoryMetaInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EvaluationTemplateFromRepository(
    @NotNull @Valid RepositoryMetaInfo repositoryMetaInfo, @NotBlank String dataSourceNames) {}
