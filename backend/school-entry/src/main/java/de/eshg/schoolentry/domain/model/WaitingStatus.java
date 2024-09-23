/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

public enum WaitingStatus {
  WAITING,
  WAITING_FOR_DOCTOR,
  WAITING_FOR_MFA,
  IN_EXAMINATION,
  IN_EXAMINATION_DOCTOR,
  IN_EXAMINATION_MFA,
  DONE,
  CANCELLED
}
