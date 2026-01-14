/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProgressEntrySortBy", defaultValue = "CREATED_AT")
public enum ProgressEntrySortByDto {
  CREATED_AT,
  MODIFIED_AT
}
