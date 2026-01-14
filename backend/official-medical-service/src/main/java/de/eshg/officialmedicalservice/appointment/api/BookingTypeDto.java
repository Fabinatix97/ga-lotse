/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.appointment.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookingType")
public enum BookingTypeDto {
  APPOINTMENT_BLOCK,
  USER_DEFINED,
}
