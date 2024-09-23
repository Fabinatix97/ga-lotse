/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WaitingStatus")
public enum WaitingStatusDto {
  WAITING,
  WAITING_FOR_DOCTOR,
  WAITING_FOR_MFA,
  IN_EXAMINATION,
  IN_EXAMINATION_DOCTOR,
  IN_EXAMINATION_MFA,
  DONE,
  CANCELLED
}
