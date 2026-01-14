/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

public enum AggregationResultState {
  PLANNED,
  COMPLETED,
  FAILED,
  CREATING,
  UPDATING,
  COPY_ONGOING,
  DELETING,
  ANONYMIZATION_FAILED
}
