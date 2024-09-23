/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.DayOfWeekDto;
import java.time.DayOfWeek;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

public abstract class DayOfWeekDtoMapper {

  private DayOfWeekDtoMapper() {}

  public static List<DayOfWeek> toJavaTime(Collection<DayOfWeekDto> source) {
    return source.stream().filter(Objects::nonNull).map(DayOfWeekDtoMapper::toJavaTime).toList();
  }

  private static DayOfWeek toJavaTime(DayOfWeekDto source) {
    if (source == null) {
      return null;
    }
    return DayOfWeek.valueOf(source.name());
  }
}
