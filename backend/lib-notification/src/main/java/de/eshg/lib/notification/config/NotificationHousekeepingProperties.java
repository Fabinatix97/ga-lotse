/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.config;

import jakarta.validation.constraints.NotNull;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.PeriodUnit;

@ConfigurationProperties(value = "de.eshg.notifications.housekeeping")
public class NotificationHousekeepingProperties {

  @NotNull
  @PeriodUnit(ChronoUnit.DAYS)
  private Period unreadMaxAgeDays = Period.ofDays(30);

  @NotNull
  @PeriodUnit(ChronoUnit.DAYS)
  private Period readMaxAgeDays = Period.ofDays(30);

  public Period getUnreadMaxAgeDays() {
    return unreadMaxAgeDays;
  }

  public void setUnreadMaxAgeDays(Period unreadMaxAgeDays) {
    this.unreadMaxAgeDays = unreadMaxAgeDays;
  }

  public Period getReadMaxAgeDays() {
    return readMaxAgeDays;
  }

  public void setReadMaxAgeDays(Period readMaxAgeDays) {
    this.readMaxAgeDays = readMaxAgeDays;
  }
}
