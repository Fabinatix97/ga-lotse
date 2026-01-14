/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.schoolentry.SchoolEntryConfigService;
import java.time.Duration;
import java.util.Map;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Primary
@Component
public class AppointmentBlockConfigImpl implements AppointmentBlockConfig {

  private final AppointmentBlockProperties appointmentBlockProperties;
  private final SchoolEntryConfigService schoolEntryConfigService;

  public AppointmentBlockConfigImpl(
      AppointmentBlockProperties appointmentBlockProperties,
      SchoolEntryConfigService schoolEntryConfigService) {
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.schoolEntryConfigService = schoolEntryConfigService;
  }

  @Override
  public Map<AppointmentType, Duration> getDefaultAppointmentTypeConfiguration() {
    return appointmentBlockProperties.getDefaultAppointmentTypeConfiguration();
  }

  @Override
  public Duration getDefaultAppointmentTypeConfiguration(AppointmentType appointmentType) {
    return appointmentBlockProperties.getDefaultAppointmentTypeConfiguration(appointmentType);
  }

  @Override
  public void setDefaultAppointmentTypeConfiguration(
      Map<AppointmentType, Duration> defaultAppointmentTypeConfiguration) {
    appointmentBlockProperties.setDefaultAppointmentTypeConfiguration(
        defaultAppointmentTypeConfiguration);
  }

  @Override
  public boolean isAllowAppointmentBlocksWithCalendarEventConflicts() {
    return appointmentBlockProperties.isAllowAppointmentBlocksWithCalendarEventConflicts();
  }

  @Override
  public void setAllowAppointmentBlocksWithCalendarEventConflicts(
      boolean allowAppointmentBlocksWithCalendarEventConflicts) {
    appointmentBlockProperties.setAllowAppointmentBlocksWithCalendarEventConflicts(
        allowAppointmentBlocksWithCalendarEventConflicts);
  }

  @Override
  public boolean isCreateAppointmentBlockForCurrentUser() {
    return appointmentBlockProperties.isCreateAppointmentBlockForCurrentUser();
  }

  @Override
  public void setCreateAppointmentBlockForCurrentUser(
      boolean createAppointmentBlockForCurrentUser) {
    appointmentBlockProperties.setCreateAppointmentBlockForCurrentUser(
        createAppointmentBlockForCurrentUser);
  }

  @Override
  public LocationSelectionMode getLocationSelectionMode() {
    return schoolEntryConfigService.getLocationSelectionMode();
  }

  @Override
  public void setLocationSelectionMode(LocationSelectionMode locationSelectionMode) {
    schoolEntryConfigService.updateLocationSelectionMode(locationSelectionMode);
  }
}
