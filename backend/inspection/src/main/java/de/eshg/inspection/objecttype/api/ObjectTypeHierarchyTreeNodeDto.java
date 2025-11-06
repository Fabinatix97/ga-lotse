/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "ObjectTypeHierarchyTreeNode")
public record ObjectTypeHierarchyTreeNodeDto(
    @NotNull @NotEmpty String name,
    @NotNull @Valid List<@NotNull @Valid ObjectTypeHierarchyTreeNodeDto> subNodes,
    @NotNull @Valid List<@NotNull @Valid ObjectTypeDto> objectTypes) {}
