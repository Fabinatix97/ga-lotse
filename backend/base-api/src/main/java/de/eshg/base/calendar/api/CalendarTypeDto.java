/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CalendarType")
public enum CalendarTypeDto {
  GLOBAL,
  RESOURCE,
  USER
}
