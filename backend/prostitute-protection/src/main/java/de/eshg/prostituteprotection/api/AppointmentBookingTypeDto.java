/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "AppointmentBookingType",
    description = "Specifies whether the appointment is a block type or an individual type.")
public enum AppointmentBookingTypeDto {
  USER_DEFINED,
  APPOINTMENT_BLOCK
}
