/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.evaluationtemplate;

import jakarta.validation.constraints.NotBlank;

public record RepoBaseDataAttribute(@NotBlank String code, @NotBlank String name) {}
