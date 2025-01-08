/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "AddPacklistDefinitionRevisionRequest")
public record AddPacklistDefinitionRevisionRequest(
    @NotBlank String name,
    String description,
    @NotNull List<@NotBlank String> elements,
    @NotNull long version) {}
