/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.waitingroom;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "WaitingStatus",
    description = "Current status of the procedure waiting in the room.")
public enum WaitingStatusDto {
  WAITING_FOR_CONSULTATION,
  WAITING_FOR_RESULTS_REVIEW,
  WAITING_FOR_TESTS,
  IN_CONSULTATION,
  IN_TESTING,
  CANCELLED,
  DONE
}
