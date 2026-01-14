/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
  IN_EXAMINATION_SOPASS,
  EXAMINATION_FINISHED,
  DONE,
  CANCELLED,
  NOT_APPEARED
}
