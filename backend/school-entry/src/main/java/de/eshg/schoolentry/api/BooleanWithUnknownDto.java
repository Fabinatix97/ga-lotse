/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BooleanWithUnknown")
public enum BooleanWithUnknownDto {
  TRUE,
  FALSE,
  UNKNOWN
}
