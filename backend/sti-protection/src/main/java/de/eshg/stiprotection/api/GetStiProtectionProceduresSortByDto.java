/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GetStiProtectionProceduresSortBy")
public enum GetStiProtectionProceduresSortByDto {
  CREATED_AT,
  STATUS,
  CONCERN,
  YEAR_OF_BIRTH,
  GENDER
}
