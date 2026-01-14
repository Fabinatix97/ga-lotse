/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WaitingStatus")
public enum WaitingStatusDto {
  WAITING_FOR_CONSULTATION,
  IN_CONSULTATION,
  DONE,
}
