/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspPendingFacilityKind")
public enum InspPendingFacilityKind {
  NEW,
  PENDING,
  OVERDUE,
}
