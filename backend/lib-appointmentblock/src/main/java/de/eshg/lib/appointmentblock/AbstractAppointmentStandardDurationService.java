/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.domain.model.BaseEntity;
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
import org.jetbrains.annotations.VisibleForTesting;

public abstract class AbstractAppointmentStandardDurationService<T extends BaseEntity>
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

  @Override
  public T getConfig() {
    return super.getConfig();
  }

  /**
   * This method is only needed by the {@link AppointmentTypeService} and should be removed when the
   * {@link AppointmentTypeService} is deleted
   */
  public Map<AppointmentType, Duration> getStandardDurations() {
    T config = getConfig();
    return appointmentDurationInfos.entrySet().stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Entry::getKey, e -> e.getValue().entityGetter().apply(config)));
  }

  /**
   * This method is only needed by the {@link AppointmentTypeService} and should be removed when the
   * {@link AppointmentTypeService} is deleted
   */
  public void updateStandardDuration(AppointmentType appointmentType, Duration durationUpdate) {
    T config = getConfig();
    AppointmentDurationInfo<T> info = appointmentDurationInfos.get(appointmentType);
    auditLogWriter.writeChangeViaLegacyGUIToAuditLog(
        "appointmentStandardDuration",
        MapUtils.orderedMapOf(info.name(), info.entityGetter().apply(config).toString()),
        MapUtils.orderedMapOf(info.name(), durationUpdate.toString()));
    info.entitySetter().accept(config, durationUpdate);
  }

  @VisibleForTesting
  public abstract void setNotInitialized();

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
