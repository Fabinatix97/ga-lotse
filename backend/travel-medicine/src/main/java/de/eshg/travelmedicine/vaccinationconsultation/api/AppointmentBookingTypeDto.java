/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AppointmentBookingType")
public enum AppointmentBookingTypeDto {
  USER_DEFINED,
  APPOINTMENT_BLOCK,
  SELF_BOOKING,
  CANCELLED
}
