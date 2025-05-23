/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GetMedsAbroadProceduresSortBy")
public enum GetMedsAbroadProceduresSortByDto {
  FIRST_NAME,
  LAST_NAME,
  DATE_OF_BIRTH,
  CREATED_AT,
  PROCEDURE_STATUS
}
