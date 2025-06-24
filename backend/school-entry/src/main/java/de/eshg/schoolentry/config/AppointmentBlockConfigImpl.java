/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import static de.eshg.schoolentry.config.SchoolEntryFeature.ALL_APPOINTMENT_TYPE_COMBINATIONS;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.schoolentry.SchoolEntryConfigService;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Primary
@Component
public class AppointmentBlockConfigImpl implements AppointmentBlockConfig {

  private final AppointmentBlockProperties appointmentBlockProperties;
  private final SchoolEntryConfigService schoolEntryConfigService;
  private final SchoolEntryFeatureToggle featureToggle;

  public AppointmentBlockConfigImpl(
      AppointmentBlockProperties appointmentBlockProperties,
      SchoolEntryConfigService schoolEntryConfigService,
      SchoolEntryFeatureToggle featureToggle) {
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.schoolEntryConfigService = schoolEntryConfigService;
    this.featureToggle = featureToggle;
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

  @Override
  public List<List<AppointmentType>> getAllowedAppointmentTypeCombinations() {
    if (featureToggle.isNewFeatureEnabled(ALL_APPOINTMENT_TYPE_COMBINATIONS)) {
      return List.of(
          List.of(AppointmentType.REGULAR_EXAMINATION, AppointmentType.ENTRY_LEVEL),
          List.of(AppointmentType.REGULAR_EXAMINATION, AppointmentType.CAN_CHILD),
          List.of(AppointmentType.REGULAR_EXAMINATION, AppointmentType.SPECIAL_NEEDS),
          List.of(AppointmentType.ENTRY_LEVEL, AppointmentType.CAN_CHILD),
          List.of(AppointmentType.ENTRY_LEVEL, AppointmentType.SPECIAL_NEEDS),
          List.of(AppointmentType.CAN_CHILD, AppointmentType.SPECIAL_NEEDS),
          List.of(
              AppointmentType.REGULAR_EXAMINATION,
              AppointmentType.ENTRY_LEVEL,
              AppointmentType.CAN_CHILD),
          List.of(
              AppointmentType.REGULAR_EXAMINATION,
              AppointmentType.ENTRY_LEVEL,
              AppointmentType.SPECIAL_NEEDS),
          List.of(
              AppointmentType.REGULAR_EXAMINATION,
              AppointmentType.CAN_CHILD,
              AppointmentType.SPECIAL_NEEDS),
          List.of(
              AppointmentType.ENTRY_LEVEL,
              AppointmentType.CAN_CHILD,
              AppointmentType.SPECIAL_NEEDS),
          List.of(
              AppointmentType.REGULAR_EXAMINATION,
              AppointmentType.ENTRY_LEVEL,
              AppointmentType.CAN_CHILD,
              AppointmentType.SPECIAL_NEEDS));
    }
    return appointmentBlockProperties.getAllowedAppointmentTypeCombinations();
  }

  @Override
  public void setAllowedAppointmentTypeCombinations(
      List<List<AppointmentType>> allowedAppointmentTypeCombinations) {
    appointmentBlockProperties.setAllowedAppointmentTypeCombinations(
        allowedAppointmentTypeCombinations);
  }
}
