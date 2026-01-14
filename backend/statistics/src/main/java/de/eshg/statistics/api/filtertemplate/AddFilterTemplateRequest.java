/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filtertemplate;

import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record AddFilterTemplateRequest(
    @NotBlank String name,
    @NotNull @Size(min = 1) @Valid List<TableColumnFilterParameter> filters) {}
