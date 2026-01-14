/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

public enum TableColumnValueType {
  BOOLEAN,
  DATE,
  DECIMAL,
  DECIMAL_INTERVAL,
  INTEGER,
  INTEGER_INTERVAL,
  TEXT,
  VALUE_WITH_OPTIONS,
  PROCEDURE_REFERENCE
}
