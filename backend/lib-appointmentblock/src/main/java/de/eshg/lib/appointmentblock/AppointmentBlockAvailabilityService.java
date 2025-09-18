/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static de.eshg.lib.appointmentblock.mapper.AuditLogMapper.getRelevantFieldsForLogging;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.lib.appointmentblock.api.AppointmentBlockDefaultAvailabilityFlagsDto;
import de.eshg.lib.appointmentblock.api.LeadTimeForAppointmentCreationDto;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockAvailabilityConfig;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
    value = "de.eshg.appointment-block-availability-flags.enabled",
    havingValue = "true")
public class AppointmentBlockAvailabilityService
    extends EshgConfigurationService<AppointmentBlockAvailabilityConfig> {

  protected AppointmentBlockAvailabilityService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, AppointmentBlockAvailabilityConfig.class);
    this.auditLogWriter = auditLogWriter;
  }

  protected final AuditLogWriter auditLogWriter;

  @Override
  protected AppointmentBlockAvailabilityConfig getInitialConfiguration() {
    return new AppointmentBlockAvailabilityConfig();
  }

  @Override
  public AppointmentBlockAvailabilityConfig getConfig() {
    return super.getConfig();
  }

  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.APPOINTMENT_BLOCK_AVAILABILITY.name(),
        toConfigStatus(getConfig().isInitialized()));
  }

  protected ConfigurationStatus toConfigStatus(boolean initialized) {
    return initialized ? ConfigurationStatus.COMPLETE : ConfigurationStatus.INCOMPLETE;
  }

  public AppointmentBlockDefaultAvailabilityFlagsDto getDefaultFlags() {
    AppointmentBlockAvailabilityConfig config = getConfig();
    return new AppointmentBlockDefaultAvailabilityFlagsDto(
        config.getAvailableForCitizen(), config.getAvailableForBulkBooking());
  }

  public AppointmentBlockDefaultAvailabilityFlagsDto getConfiguredDefaultFlags() {
    AppointmentBlockAvailabilityConfig config = getConfig();

    if (!config.isInitialized()) {
      return null;
    }

    return new AppointmentBlockDefaultAvailabilityFlagsDto(
        config.getAvailableForCitizen(), config.getAvailableForBulkBooking());
  }

  public LeadTimeForAppointmentCreationDto getDefaultLeadTimes() {
    AppointmentBlockAvailabilityConfig config = getConfig();

    return new LeadTimeForAppointmentCreationDto(
        config.getBulkCreateAppointmentsMinLeadTime(),
        config.getCitizenFreeAppointmentsMinLeadTime(),
        config.getCitizenFreeAppointmentsMaxLeadTime());
  }

  public LeadTimeForAppointmentCreationDto getConfiguredDefaultLeadTimes() {
    AppointmentBlockAvailabilityConfig config = getConfig();

    if (!config.isInitialized()) {
      return null;
    }

    return new LeadTimeForAppointmentCreationDto(
        config.getBulkCreateAppointmentsMinLeadTime(),
        config.getCitizenFreeAppointmentsMinLeadTime(),
        config.getCitizenFreeAppointmentsMaxLeadTime());
  }

  public void updateAvailability(AppointmentBlockAvailabilityConfig newConfig) {
    AppointmentBlockAvailabilityConfig config = getConfig();

    auditLogWriter.writeChangeToAuditLog(
        "appointmentBlockAvailability",
        getRelevantFieldsForLogging(config),
        getRelevantFieldsForLogging(newConfig));

    config.setAvailableForCitizen(newConfig.getAvailableForCitizen());
    config.setAvailableForBulkBooking(newConfig.getAvailableForBulkBooking());
    config.setBulkCreateAppointmentsMinLeadTime(newConfig.getBulkCreateAppointmentsMinLeadTime());
    config.setCitizenFreeAppointmentsMinLeadTime(newConfig.getCitizenFreeAppointmentsMinLeadTime());
    config.setCitizenFreeAppointmentsMaxLeadTime(newConfig.getCitizenFreeAppointmentsMaxLeadTime());
    config.setInitialized(true);
  }
}
