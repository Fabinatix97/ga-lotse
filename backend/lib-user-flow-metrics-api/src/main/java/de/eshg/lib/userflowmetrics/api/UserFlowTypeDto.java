/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UserFlowType")
public enum UserFlowTypeDto {
  ANAMNESIS,
  BOOKING,
  CANCELING,
  INFORMATION_STATEMENT,
  REPORTING,
  RESCHEDULING,
}
