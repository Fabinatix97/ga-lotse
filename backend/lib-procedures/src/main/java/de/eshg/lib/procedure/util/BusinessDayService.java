/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.util;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Component;

@Component
public class BusinessDayService {

  private final Clock clock;

  public BusinessDayService(Clock clock) {
    this.clock = clock;
  }

  public Instant minusBusinessDays(Instant instant, int businessDays) {
    Instant currentInstant = instant;
    int currentBusinessDays = 0;

    while (currentBusinessDays < businessDays) {
      currentInstant = currentInstant.minus(1, ChronoUnit.DAYS);
      if (isBusinessDay(currentInstant)) {
        currentBusinessDays++;
      }
    }

    return currentInstant;
  }

  public Instant nowPlusBusinessDays(int businessDays) {
    int currentBusinessDays = 0;
    Instant currentInstant = Instant.now(clock);

    while (currentBusinessDays < businessDays) {
      currentInstant = currentInstant.plus(1, ChronoUnit.DAYS);
      if (isBusinessDay(currentInstant)) {
        currentBusinessDays++;
      }
    }

    return currentInstant;
  }

  private boolean isWeekend(Instant instant) {
    ZonedDateTime zonedDateTime = instant.atZone(clock.getZone());
    DayOfWeek dayofWeek = zonedDateTime.getDayOfWeek();
    return dayofWeek == DayOfWeek.SATURDAY || dayofWeek == DayOfWeek.SUNDAY;
  }

  private boolean isBusinessDay(Instant instant) {
    return !isWeekend(instant);
  }
}
