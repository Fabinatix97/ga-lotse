/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "DayOfWeek")
public enum DayOfWeekDto {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY;

  public static List<DayOfWeekDto> allDays() {
    return List.of(DayOfWeekDto.values());
  }
}
