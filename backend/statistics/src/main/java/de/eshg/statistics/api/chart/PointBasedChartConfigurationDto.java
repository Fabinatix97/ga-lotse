/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import de.eshg.statistics.api.AttributeSelectionDto;

public sealed interface PointBasedChartConfigurationDto
    permits LineChartConfigurationDto, ScatterChartConfigurationDto {
  AttributeSelectionDto xAttribute();

  AttributeSelectionDto yAttribute();

  AttributeSelectionDto secondaryAttribute();

  RangeDto range();
}
