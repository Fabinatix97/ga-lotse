/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import de.eshg.base.SortDirection;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.TableColumnHeader;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEvaluationResponse(
    @NotNull @Valid EvaluationInfo evaluationInfo,
    @Valid AttributeSelectionDto sortAttribute,
    @NotNull SortDirection sortDirection,
    @NotNull @Valid List<TableColumnHeader> tableColumnHeaders,
    @NotNull @Valid List<DataRow> dataRows,
    @NotNull @Min(0) long totalNumberOfElements) {}
