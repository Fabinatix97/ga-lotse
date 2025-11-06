/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionSampleType")
public enum InspectionSampleTypeDto {
  DRINKING_WATER,
  BATH_WATER,
  ;
  // TODO More elements to follow when we have all the information.
}
