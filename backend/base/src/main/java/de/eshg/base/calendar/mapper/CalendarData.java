/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.mapper;

import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarType;
import java.util.UUID;

public class CalendarData {
  private final UUID externalId;
  private final CalendarType type;
  private final String globalCalendarName;
  private final UUID userId;
  private final UUID resourceId;

  public CalendarData(Calendar calendar) {
    externalId = calendar.getExternalId();
    type = calendar.getType();
    globalCalendarName = calendar.getGlobalCalendarName();
    userId = calendar.getUserId();
    resourceId = calendar.getResourceId();
  }

  public UUID getExternalId() {
    return externalId;
  }

  public CalendarType getType() {
    return type;
  }

  public String getGlobalCalendarName() {
    return globalCalendarName;
  }

  public UUID getUserId() {
    return userId;
  }

  public UUID getResourceId() {
    return resourceId;
  }
}
