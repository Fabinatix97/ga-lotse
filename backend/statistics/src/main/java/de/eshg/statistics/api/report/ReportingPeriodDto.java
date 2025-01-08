/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ReportingPeriod")
public enum ReportingPeriodDto {
  MONTH,
  THREE_MONTHS,
  HALF_YEAR,
  YEAR,
}
