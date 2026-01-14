/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record AddDiagramRequest(
    @NotBlank String title, String description, @Valid List<TableColumnFilterParameter> filters) {}
