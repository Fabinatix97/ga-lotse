/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.statistics.api.DateSpan;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

public record GetReportsFilterOptions(
    String name,
    ReportTypeDto reportType,
    List<UUID> dataSourceIds,
    @Valid DateSpan start,
    @Valid DateSpan end,
    List<ReportDataSensitivity> dataSensitivities) {}
