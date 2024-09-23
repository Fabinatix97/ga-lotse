/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.api.attributes.AbstractTableColumnHeaderAttribute;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record TableColumnHeader(
    @NotBlank String businessModule,
    @NotNull UUID dataSourceId,
    @NotBlank String dataSourceName,
    @NotNull @Valid AbstractTableColumnHeaderAttribute attribute) {}
