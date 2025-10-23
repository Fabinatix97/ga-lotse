/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.spring;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.constraints.NotEmpty;
import java.time.Duration;
import java.util.Map;
import org.hibernate.validator.constraints.time.DurationMin;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.lib.appointmentblock")
public final class AppointmentBlockProperties
    implements ResettableProperties, AppointmentBlockConfig {

  @NotEmpty
  private Map<AppointmentType, @DurationMin(minutes = 1) Duration>
      defaultAppointmentTypeConfiguration;

  private boolean allowAppointmentBlocksWithCalendarEventConflicts = true;
  private boolean createAppointmentBlockForCurrentUser = true;
  private LocationSelectionMode locationSelectionMode = LocationSelectionMode.NONE;

  @Override
  public Map<AppointmentType, Duration> getDefaultAppointmentTypeConfiguration() {
    return defaultAppointmentTypeConfiguration;
  }

  @Override
  public Duration getDefaultAppointmentTypeConfiguration(AppointmentType appointmentType) {
    return getDefaultAppointmentTypeConfiguration().get(appointmentType);
  }

  @Override
  public void setDefaultAppointmentTypeConfiguration(
      Map<AppointmentType, Duration> defaultAppointmentTypeConfiguration) {
    this.defaultAppointmentTypeConfiguration = defaultAppointmentTypeConfiguration;
  }

  @Override
  public boolean isAllowAppointmentBlocksWithCalendarEventConflicts() {
    return allowAppointmentBlocksWithCalendarEventConflicts;
  }

  @Override
  public void setAllowAppointmentBlocksWithCalendarEventConflicts(
      boolean allowAppointmentBlocksWithCalendarEventConflicts) {
    this.allowAppointmentBlocksWithCalendarEventConflicts =
        allowAppointmentBlocksWithCalendarEventConflicts;
  }

  @Override
  public boolean isCreateAppointmentBlockForCurrentUser() {
    return createAppointmentBlockForCurrentUser;
  }

  @Override
  public void setCreateAppointmentBlockForCurrentUser(
      boolean createAppointmentBlockForCurrentUser) {
    this.createAppointmentBlockForCurrentUser = createAppointmentBlockForCurrentUser;
  }

  @Override
  public LocationSelectionMode getLocationSelectionMode() {
    return locationSelectionMode;
  }

  @Override
  public void setLocationSelectionMode(LocationSelectionMode locationSelectionMode) {
    this.locationSelectionMode = locationSelectionMode;
  }
}
