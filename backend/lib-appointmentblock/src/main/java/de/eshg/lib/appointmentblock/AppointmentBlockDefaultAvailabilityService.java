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
import de.eshg.lib.appointmentblock.api.AppointmentBlockDefaultAvailabilityDto;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockDefaultAvailabilityConfig;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
    value = "de.eshg.appointment-block-availability-flags.enabled",
    havingValue = "true")
public class AppointmentBlockDefaultAvailabilityService
    extends EshgConfigurationService<AppointmentBlockDefaultAvailabilityConfig> {

  protected AppointmentBlockDefaultAvailabilityService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, AppointmentBlockDefaultAvailabilityConfig.class);
    this.auditLogWriter = auditLogWriter;
  }

  protected final AuditLogWriter auditLogWriter;

  @Override
  protected AppointmentBlockDefaultAvailabilityConfig getInitialConfiguration() {
    return new AppointmentBlockDefaultAvailabilityConfig();
  }

  @Override
  public AppointmentBlockDefaultAvailabilityConfig getConfig() {
    return super.getConfig();
  }

  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.APPOINTMENT_BLOCK_DEFAULT_AVAILABILITY.name(),
        toConfigStatus(getConfig().isInitialized()));
  }

  protected ConfigurationStatus toConfigStatus(boolean initialized) {
    return initialized ? ConfigurationStatus.COMPLETE : ConfigurationStatus.INCOMPLETE;
  }

  public AppointmentBlockDefaultAvailabilityDto getDefaultFlags() {
    AppointmentBlockDefaultAvailabilityConfig config = getConfig();
    return new AppointmentBlockDefaultAvailabilityDto(
        config.getAvailableForCitizen(), config.getAvailableForBulkBooking());
  }

  public AppointmentBlockDefaultAvailabilityDto getConfiguredDefaultFlags() {
    AppointmentBlockDefaultAvailabilityConfig config = getConfig();

    if (!config.isInitialized()) {
      return null;
    }

    return new AppointmentBlockDefaultAvailabilityDto(
        config.getAvailableForCitizen(), config.getAvailableForBulkBooking());
  }

  public void updateDefaultFlags(AppointmentBlockDefaultAvailabilityConfig newConfig) {
    AppointmentBlockDefaultAvailabilityConfig config = getConfig();

    auditLogWriter.writeChangeToAuditLog(
        "appointmentBlockDefaultAvailability",
        getRelevantFieldsForLogging(config),
        getRelevantFieldsForLogging(newConfig));

    config.setAvailableForCitizen(newConfig.getAvailableForCitizen());
    config.setAvailableForBulkBooking(newConfig.getAvailableForBulkBooking());
    config.setInitialized(true);
  }
}
