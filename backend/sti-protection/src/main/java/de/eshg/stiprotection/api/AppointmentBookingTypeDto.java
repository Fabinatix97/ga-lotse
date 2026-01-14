/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "AppointmentBookingType",
    description = "Specifies whether the appointment is a block type or an individual type.")
public enum AppointmentBookingTypeDto {
  USER_DEFINED,
  APPOINTMENT_BLOCK
}
