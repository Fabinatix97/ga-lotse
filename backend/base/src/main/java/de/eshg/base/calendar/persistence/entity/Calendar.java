/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.entity;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class Calendar extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CalendarType type;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(unique = true)
  private String globalCalendarName;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(unique = true)
  private UUID userId;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(unique = true)
  private UUID resourceId;

  public CalendarType getType() {
    return type;
  }

  public void setType(CalendarType type) {
    this.type = type;
  }

  public String getGlobalCalendarName() {
    return globalCalendarName;
  }

  public void setGlobalCalendarName(String globalCalendarName) {
    this.globalCalendarName = globalCalendarName;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public UUID getResourceId() {
    return resourceId;
  }

  public void setResourceId(UUID resourceId) {
    this.resourceId = resourceId;
  }
}
