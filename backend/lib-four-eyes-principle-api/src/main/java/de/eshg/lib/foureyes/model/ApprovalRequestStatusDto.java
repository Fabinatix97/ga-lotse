/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ApprovalRequestStatus")
public enum ApprovalRequestStatusDto {
  OPEN,
  CLOSED
}
