/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

public enum AggregationResultPendingState {
  DATA_AGGREGATION,
  MIN_MAX_DETERMINATION,
  EVALUATION_CONDUCTION,
  COPY_ONGOING,
  DIAGRAM_CREATION,
}
