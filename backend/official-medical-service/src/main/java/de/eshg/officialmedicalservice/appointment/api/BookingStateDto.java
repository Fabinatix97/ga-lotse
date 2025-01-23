/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookingState")
public enum BookingStateDto {
  BOOKABLE,
  BOOKED,
  CANCELLED,
  WITHDRAWN
}
