/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WaitingStatus")
public enum WaitingStatusDto {
  WAITING,
  IN_CONSULTATION,
  DONE
}
