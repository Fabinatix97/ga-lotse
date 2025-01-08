/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record RepoAttributeSelection(
    @NotBlank String businessModuleName,
    @NotNull UUID dataSourceId,
    @NotBlank String businessModuleAttributeCode,
    String baseModuleAttributeCode) {}
