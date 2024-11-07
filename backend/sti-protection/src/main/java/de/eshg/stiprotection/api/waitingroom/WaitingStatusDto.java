/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.waitingroom;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WaitingStatus")
public enum WaitingStatusDto {
  WAITING_FOR_CONSULTATION,
  WAITING_FOR_RESULTS_REVIEW,
  WAITING_FOR_TESTS,
  IN_CONSULTATION,
  IN_TESTING,
  CANCELLED,
  DONE
}
