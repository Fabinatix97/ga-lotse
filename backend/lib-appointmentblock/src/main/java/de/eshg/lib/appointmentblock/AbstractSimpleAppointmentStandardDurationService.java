/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.Map;
import java.util.SequencedMap;
import java.util.function.Supplier;

public abstract class AbstractSimpleAppointmentStandardDurationService<
        T extends BaseEntity & Initializable>
    extends AbstractAppointmentStandardDurationService<T> {

  private final ConfigurationEndpoint configurationEndpoint;

  protected AbstractSimpleAppointmentStandardDurationService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      AppointmentBlockProperties appointmentBlockProperties,
      Map<AppointmentType, AppointmentDurationInfo<T>> appointmentDurationInfos,
      Class<T> configClass,
      Supplier<T> configClassConstructor,
      ConfigurationEndpoint configurationEndpoint) {
    super(
        entityManager,
        transactionHelper,
        auditLogWriter,
        appointmentBlockProperties,
        appointmentDurationInfos,
        configClass,
        configClassConstructor);
    this.configurationEndpoint = configurationEndpoint;
  }

  public void updateAppointmentStandardDurations(T entityUpdate) {
    validateStandardDurationUpdate(entityUpdate);
    T persistentEntity = getConfig();
    auditLogWriter.writeChangeToAuditLog(
        "appointmentStandardDuration",
        getRelevantFieldsForLogging(persistentEntity),
        getRelevantFieldsForLogging(entityUpdate));
    appointmentDurationInfos
        .values()
        .forEach(
            info ->
                info.entitySetter()
                    .accept(persistentEntity, info.entityGetter().apply(entityUpdate)));
    persistentEntity.setInitialized(true);
  }

  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        configurationEndpoint.name(), toConfigStatus(getConfig().isInitialized()));
  }

  private Map<String, String> getRelevantFieldsForLogging(T entity) {
    return appointmentDurationInfos.values().stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                AppointmentDurationInfo::name,
                info -> info.entityGetter().apply(entity).toString()));
  }
}
