/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionSampleEvaluationType")
public enum InspectionSampleEvaluationTypeDto {
  ON_SITE,
  LABORATORY,
  ;
}
