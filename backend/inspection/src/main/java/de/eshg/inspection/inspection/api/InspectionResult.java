/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionResult")
public enum InspectionResult {
  /** this is the default result, meaning: no result yet */
  OPEN,
  SUCCESSFUL,
  FAILED,
  SUCCESSFUL_WITH_INCIDENTS
}
