/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.chart;

import de.eshg.statistics.persistence.entity.AttributeSelection;

public interface TwoAttributesChartConfiguration {
  AttributeSelection getPrimaryAttributeSelection();

  AttributeSelection getSecondaryAttributeSelection();
}
