/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.spring;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
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
public final class AppointmentBlockProperties implements ResettableProperties {

  @NotEmpty
  private Map<AppointmentType, @DurationMin(minutes = 1) Duration>
      defaultAppointmentTypeConfiguration;

  private boolean allowAppointmentBlocksWithCalendarEventConflicts = true;
  private boolean createAppointmentBlockForCurrentUser = true;
  private LocationSelectionMode locationSelectionMode = LocationSelectionMode.NONE;

  public Map<AppointmentType, Duration> getDefaultAppointmentTypeConfiguration() {
    return defaultAppointmentTypeConfiguration;
  }

  public Duration getDefaultAppointmentTypeConfiguration(AppointmentType appointmentType) {
    return getDefaultAppointmentTypeConfiguration().get(appointmentType);
  }

  public void setDefaultAppointmentTypeConfiguration(
      Map<AppointmentType, Duration> defaultAppointmentTypeConfiguration) {
    this.defaultAppointmentTypeConfiguration = defaultAppointmentTypeConfiguration;
  }

  public boolean isAllowAppointmentBlocksWithCalendarEventConflicts() {
    return allowAppointmentBlocksWithCalendarEventConflicts;
  }

  public void setAllowAppointmentBlocksWithCalendarEventConflicts(
      boolean allowAppointmentBlocksWithCalendarEventConflicts) {
    this.allowAppointmentBlocksWithCalendarEventConflicts =
        allowAppointmentBlocksWithCalendarEventConflicts;
  }

  public boolean isCreateAppointmentBlockForCurrentUser() {
    return createAppointmentBlockForCurrentUser;
  }

  public void setCreateAppointmentBlockForCurrentUser(
      boolean createAppointmentBlockForCurrentUser) {
    this.createAppointmentBlockForCurrentUser = createAppointmentBlockForCurrentUser;
  }

  public LocationSelectionMode getLocationSelectionMode() {
    return locationSelectionMode;
  }

  public void setLocationSelectionMode(LocationSelectionMode locationSelectionMode) {
    this.locationSelectionMode = locationSelectionMode;
  }
}
