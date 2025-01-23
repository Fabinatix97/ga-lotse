/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookingType")
public enum BookingTypeDto {
  APPOINTMENT_BLOCK,
  USER_DEFINED,
}
