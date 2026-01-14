/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.lib.appointmentblock.model.AbstractAppointmentStandardDuration;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.BadRequestException;
import jakarta.persistence.EntityManager;
import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Supplier;

public abstract class AbstractAppointmentStandardDurationService<
        T extends AbstractAppointmentStandardDuration>
    extends EshgConfigurationService<T> {

  protected AbstractAppointmentStandardDurationService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      AppointmentBlockProperties appointmentBlockProperties,
      Map<AppointmentType, AppointmentDurationInfo<T>> appointmentTypeInfos,
      Class<T> configClass,
      Supplier<T> configClassConstructor) {
    super(entityManager, transactionHelper, configClass);
    this.auditLogWriter = auditLogWriter;
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.appointmentDurationInfos = Collections.unmodifiableMap(appointmentTypeInfos);
    this.configClassConstructor = configClassConstructor;
  }

  protected final AuditLogWriter auditLogWriter;
  private final AppointmentBlockProperties appointmentBlockProperties;
  protected final Map<AppointmentType, AppointmentDurationInfo<T>> appointmentDurationInfos;
  private final Supplier<T> configClassConstructor;

  @Override
  protected T getInitialConfiguration() throws Exception {
    T entity = configClassConstructor.get();
    for (Entry<AppointmentType, AppointmentDurationInfo<T>> appointmentTypeInfoEntry :
        appointmentDurationInfos.entrySet()) {
      appointmentTypeInfoEntry
          .getValue()
          .entitySetter()
          .accept(
              entity,
              getDurationOrThrow(appointmentBlockProperties, appointmentTypeInfoEntry.getKey()));
    }
    return entity;
  }

  public Duration getStandardDuration(AppointmentType appointmentType) {
    Map<AppointmentType, Duration> standardDurations = getStandardDurations();
    if (standardDurations.containsKey(appointmentType)) {
      return standardDurations.get(appointmentType);
    } else {
      throw new BadRequestException("Unknown AppointmentType " + appointmentType);
    }
  }

  public Duration getExtraDuration() {
    T config = getConfig();
    return config.getExtraDuration();
  }

  @Override
  public T getConfig() {
    return super.getConfig();
  }

  public Map<AppointmentType, Duration> getStandardDurations() {
    T config = getConfig();
    return appointmentDurationInfos.entrySet().stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Entry::getKey, e -> e.getValue().entityGetter().apply(config)));
  }

  protected ConfigurationStatus toConfigStatus(boolean initialized) {
    return initialized ? ConfigurationStatus.COMPLETE : ConfigurationStatus.INCOMPLETE;
  }

  private static Duration getDurationOrThrow(
      AppointmentBlockProperties properties, AppointmentType appointmentType) {
    Duration result = properties.getDefaultAppointmentTypeConfiguration(appointmentType);
    if (result == null) {
      throw new BadRequestException("Unknown AppointmentType " + appointmentType);
    } else {
      return result;
    }
  }

  protected void validateStandardDurationUpdate(T entityUpdate) {
    Duration[] durations =
        appointmentDurationInfos.values().stream()
            .map(info -> info.entityGetter().apply(entityUpdate))
            .toArray(Duration[]::new);
    validateStandardDurations(durations);
  }

  protected void validateStandardDurations(Duration... durations) {
    for (Duration duration : durations) {
      validateRange(duration);
      validateMultipleOfFive(duration);
    }
  }

  private void validateRange(Duration duration) {
    long minutes = duration.toMinutes();
    if (minutes < 5L || 240L < minutes) {
      throw new BadRequestException(
          "Appointment standard duration must be between 5 and 240 minutes.");
    }
  }

  private void validateMultipleOfFive(Duration duration) {
    if (!DurationUtil.isDivisible(duration, Duration.ofMinutes(5))) {
      throw new BadRequestException(
          "Appointment standard duration must be a multiple of 5 minutes.");
    }
  }
}
