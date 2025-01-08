/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WebSearchStatus")
public enum WebSearchStatusDto {
  NEW,
  IDLE,
  RUNNING,
  PAUSED,
  ERRONEOUS
}
