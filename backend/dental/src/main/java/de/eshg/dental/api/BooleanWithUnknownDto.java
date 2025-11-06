/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BooleanWithUnknown")
public enum BooleanWithUnknownDto {
  TRUE,
  FALSE,
  UNKNOWN
}
