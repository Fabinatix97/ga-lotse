/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.config.AuditLogWriter;
import de.eshg.config.domain.OpeningHours;
import de.eshg.config.initialization.MandatoryInitialOpeningHours;
import de.eshg.config.spring.ConditionalOnBusinessModule;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnBusinessModule
@ConditionalOnMissingBean(AbstractOpeningHoursService.class)
@EnableConfigurationProperties(MandatoryInitialOpeningHours.class)
@ConditionalOnProperty(
    value = "de.eshg.opening-hours.enabled",
    havingValue = "true",
    matchIfMissing = true)
public class OpeningHoursService extends AbstractOpeningHoursService<OpeningHours> {

  public OpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      MandatoryInitialOpeningHours initialOpeningHours) {
    super(
        entityManager, transactionHelper, initialOpeningHours, auditLogWriter, OpeningHours.class);
  }

  @Override
  protected OpeningHours createEmptyOpeningHoursEntity() {
    return new OpeningHours();
  }
}
