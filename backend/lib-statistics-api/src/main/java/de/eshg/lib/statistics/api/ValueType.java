/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

/**
 * There are two special kinds of {@code ValueType}:
 *
 * <ol>
 *   <li>{@code PROCEDURE_ID}: If there is a corresponding procedure the frontend will create a link
 *       to this procedure for this data row.
 *   <li>{@code CENTRAL_FILE_ID}: An attribute of this type should be provided if there is a
 *       reference to a subject in the central file.
 * </ol>
 */
public enum ValueType {
  BOOLEAN,
  DATE,
  DECIMAL,
  INTEGER,
  TEXT,
  VALUE_WITH_OPTIONS,
  PROCEDURE_ID,
  CENTRAL_FILE_ID_PERSON,
  CENTRAL_FILE_ID_FACILITY
}
