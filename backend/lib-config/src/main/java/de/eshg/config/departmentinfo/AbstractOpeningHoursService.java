/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.departmentinfo.ConfigAuditLogMapper.getRelevantFieldsForLogging;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.AbstractOpeningHours;
import de.eshg.config.initialization.MandatoryInitialOpeningHours;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.SequencedMap;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractOpeningHoursService<O extends AbstractOpeningHours>
    extends EshgConfigurationService<O> {
  protected final MandatoryInitialOpeningHours initialOpeningHours;
  private final AuditLogWriter auditLogWriter;

  protected AbstractOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MandatoryInitialOpeningHours initialOpeningHours,
      AuditLogWriter auditLogWriter,
      Class<O> configClass) {
    super(entityManager, transactionHelper, configClass);
    this.initialOpeningHours = initialOpeningHours;
    this.auditLogWriter = auditLogWriter;
  }

  @Override
  public O getConfig() {
    return super.getConfig();
  }

  @Transactional
  public void updateOpeningHours(List<String> de, List<String> en) {
    O config = getConfig();
    auditLogWriter.writeChangeToAuditLog(
        "openingHours",
        getRelevantFieldsForLogging(config.getDe(), config.getEn()),
        getRelevantFieldsForLogging(de, en));
    config.setInitialized(true);
    config.setDe(de);
    config.setEn(en);
  }

  @Override
  protected O getInitialConfiguration() {
    O openingHours = createEmptyOpeningHoursEntity();
    openingHours.setDe(initialOpeningHours.de());
    openingHours.setEn(initialOpeningHours.en());
    return openingHours;
  }

  protected abstract O createEmptyOpeningHoursEntity();

  protected ConfigurationStatus toConfigurationStatus(O config) {
    if (config.isInitialized()) {
      return ConfigurationStatus.COMPLETE;
    } else {
      return ConfigurationStatus.INCOMPLETE;
    }
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.OPENING_HOURS.name(), toConfigurationStatus(getConfig()));
  }
}
