/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolRecommendation", description = "Recommendation for school enrolment.")
public enum SchoolRecommendationDto {
  BACK_REGULAR,
  BACK_ENTRY_LEVEL,
  CONCERNS_EARLY_ENROLMENT,
  ADVICE_CENTER,
  NO
}
