/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

public enum AggregationResultPendingState {
  TABLE_ROWS_REMOVAL,
  DATA_AGGREGATION,
  MIN_MAX_DETERMINATION,
  ANALYSIS_CONDUCTION,
  COPY_ONGOING,
  DIAGRAM_CREATION
}
