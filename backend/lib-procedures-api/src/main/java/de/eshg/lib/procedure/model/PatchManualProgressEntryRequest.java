/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import org.openapitools.jackson.nullable.JsonNullable;

public record PatchManualProgressEntryRequest(
    @NotNull @Schema(requiredMode = RequiredMode.NOT_REQUIRED)
        JsonNullable<ManualProgressEntryTypeDto> manualProgressEntryType,
    @Schema(nullable = true) JsonNullable<String> note) {}
