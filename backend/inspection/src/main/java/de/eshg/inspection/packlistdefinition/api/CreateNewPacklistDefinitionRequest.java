/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "CreateNewPacklistDefinitionRequest")
public record CreateNewPacklistDefinitionRequest(
    @NotBlank String name,
    String description,
    @NotNull UUID objectTypeId,
    @NotNull List<@NotBlank String> elements) {}
