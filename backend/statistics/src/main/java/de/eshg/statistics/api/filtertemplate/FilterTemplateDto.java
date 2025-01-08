/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filtertemplate;

import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Schema(name = "FilterTemplate")
public record FilterTemplateDto(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull @Size(min = 1) @Valid List<TableColumnFilterParameter> filters) {}
