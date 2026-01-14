/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GetMeaslesProtectionProceduresSortBy")
public enum GetMeaslesProtectionProceduresSortByDto {
  FIRST_NAME,
  LAST_NAME,
  DATE_OF_BIRTH,
  CREATED_AT,
  FACILITY_NAME,
  FACILITY_TYPE,
  CASE_STATUS,
  PROCEDURE_STATUS
}
