/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.evaluationtemplate;

import de.eshg.statistics.centralrepository.dto.filter.RepoFilter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record RepoDiagramTemplate(
    @NotBlank String title, String description, @Valid List<RepoFilter> filters) {}
