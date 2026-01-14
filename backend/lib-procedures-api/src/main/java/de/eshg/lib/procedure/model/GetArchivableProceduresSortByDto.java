/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GetArchivableProceduresSortBy")
public enum GetArchivableProceduresSortByDto {
  CLOSED_AT,
  PROCEDURE_TYPE,
}
