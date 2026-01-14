/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "eshg.calendar", ignoreUnknownFields = false)
@Validated
public class CalendarProperties {

  private final Resource regionalHolidayIcsPath;

  public CalendarProperties(
      @DefaultValue("classpath:calendar/hessian-public-holidays.ics")
          Resource regionalHolidayIcsPath) {
    this.regionalHolidayIcsPath = regionalHolidayIcsPath;
    if (!regionalHolidayIcsPath.exists()) {
      throw new IllegalArgumentException(regionalHolidayIcsPath + " does not exist");
    }
  }

  public Resource getRegionalHolidayIcsPath() {
    return regionalHolidayIcsPath;
  }
}
