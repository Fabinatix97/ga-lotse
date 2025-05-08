/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.spring;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import java.time.Duration;
import java.util.Map;

public interface AppointmentBlockConfig {
  Map<AppointmentType, Duration> getDefaultAppointmentTypeConfiguration();

  Duration getDefaultAppointmentTypeConfiguration(AppointmentType appointmentType);

  void setDefaultAppointmentTypeConfiguration(
      Map<AppointmentType, Duration> defaultAppointmentTypeConfiguration);

  boolean isOverwriteAppointmentTypeConfigurationWithProperties();

  void setOverwriteAppointmentTypeConfigurationWithProperties(
      boolean overwriteAppointmentTypeConfigurationWithProperties);

  boolean isAllowAppointmentBlocksWithCalendarEventConflicts();

  void setAllowAppointmentBlocksWithCalendarEventConflicts(
      boolean allowAppointmentBlocksWithCalendarEventConflicts);

  boolean isCreateAppointmentBlockForCurrentUser();

  void setCreateAppointmentBlockForCurrentUser(boolean createAppointmentBlockForCurrentUser);

  LocationSelectionMode getLocationSelectionMode();

  void setLocationSelectionMode(LocationSelectionMode locationSelectionMode);
}
