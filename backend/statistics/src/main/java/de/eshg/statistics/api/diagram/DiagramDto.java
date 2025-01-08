/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "Diagram")
public record DiagramDto(
    @NotNull UUID id,
    @NotBlank String title,
    String description,
    @NotNull int evaluatedDataAmount,
    @NotNull @Valid List<TableColumnFilterParameter> filters,
    @NotNull @Valid DiagramDataDto diagramData) {}
