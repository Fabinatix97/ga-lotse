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
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.EntityManager;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
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
  public void updateOpeningHours(Map<Language, List<String>> localizations) {
    O config = getConfig();
    final var before = getRelevantFieldsForLogging(config);

    config.setInitialized(true);
    for (Language language : Language.values()) {
      config.set(language, localizations.get(language));
    }
    auditLogWriter.writeChangeToAuditLog(
        "openingHours", before, getRelevantFieldsForLogging(config));
  }

  @Override
  protected O getInitialConfiguration() {
    O openingHours = createEmptyOpeningHoursEntity();
    openingHours.set(Language.GERMAN, initialOpeningHours.de());
    openingHours.set(Language.ENGLISH, initialOpeningHours.en());
    return openingHours;
  }

  protected abstract O createEmptyOpeningHoursEntity();

  protected ConfigurationStatus toConfigurationStatus(O config) {
    if (config.isInitialized()
        && Arrays.stream(Language.values()).noneMatch(lang -> config.get(lang).isEmpty())) {
      return ConfigurationStatus.COMPLETE;
    } else if (config.isInitialized()
        && Arrays.stream(Language.values()).filter(lang -> !config.get(lang).isEmpty()).count()
            < Language.values().length) {
      return ConfigurationStatus.PARTIALLY_COMPLETE;
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
