/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AttributeSelection")
public record AttributeSelectionDto(
    @NotBlank String businessModuleName,
    @NotNull UUID dataSourceId,
    @NotBlank String businessModuleAttributeCode,
    String baseModuleAttributeCode) {}
