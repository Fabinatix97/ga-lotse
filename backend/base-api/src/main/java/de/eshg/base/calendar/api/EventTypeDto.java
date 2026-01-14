/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EventType")
public enum EventTypeDto {
  BUSINESS_CASE,
  HOLIDAY,
  SERVICE,
  VACATION
}
