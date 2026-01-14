/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.waitingroom;

public enum WaitingStatus {
  WAITING_FOR_CONSULTATION,
  WAITING_FOR_RESULTS_REVIEW,
  WAITING_FOR_TESTS,
  IN_CONSULTATION,
  IN_TESTING,
  CANCELLED,
  DONE
}
