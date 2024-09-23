/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.chart;

import de.eshg.statistics.persistence.entity.AttributeSelection;

public interface LineOrScatterChartConfiguration {
  AttributeSelection getXAttributeSelection();

  AttributeSelection getYAttributeSelection();

  AttributeSelection getSecondaryAttributeSelection();
}
