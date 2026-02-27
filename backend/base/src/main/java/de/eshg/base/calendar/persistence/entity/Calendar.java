/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.AssertFalse;
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

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(unique = true)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BusinessModule businessModule;

  @AssertFalse(message = "A businessModule is required for calendarType MODULE")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean hasBusinessModuleWithCalendarTypeModule() {
    return CalendarType.MODULE.equals(type) && businessModule == null;
  }

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

  public BusinessModule getBusinessModule() {
    return businessModule;
  }

  public void setBusinessModule(BusinessModule businessModule) {
    this.businessModule = businessModule;
  }
}
