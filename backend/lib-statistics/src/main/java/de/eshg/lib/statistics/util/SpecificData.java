/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataTableHeader;
import java.time.Instant;
import java.util.List;

public record SpecificData(
    String dataSourceName,
    Instant timeRangeStart,
    Instant timeRangeEnd,
    DataTableHeader dataTableHeader,
    List<DataRow> dataRows,
    long totalNumberOfElements) {}
