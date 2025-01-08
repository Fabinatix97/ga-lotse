/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
