/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AppointmentStatus", description = "Indicates the status of the appointment.")
public enum AppointmentStatusDto {
  OPEN,
  CLOSED,
  CANCELLED
}
