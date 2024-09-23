/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ReportState")
public enum ReportStateDto {
  PLANNED,
  COMPLETED,
  FAILED,
  PENDING
}
