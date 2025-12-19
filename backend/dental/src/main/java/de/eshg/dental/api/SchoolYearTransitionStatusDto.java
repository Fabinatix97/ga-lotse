/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolYearTransitionStatus")
public enum SchoolYearTransitionStatusDto {
  COMPLETE,
  INCOMPLETE
}
