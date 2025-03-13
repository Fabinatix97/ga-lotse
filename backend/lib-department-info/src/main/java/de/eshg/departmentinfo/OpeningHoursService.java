/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.departmentinfo.domain.OpeningHours;
import de.eshg.departmentinfo.initialization.MandatoryInitialOpeningHours;
import de.eshg.departmentinfo.spring.ConditionalOnBusinessModule;
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
      MandatoryInitialOpeningHours initialOpeningHours) {
    super(entityManager, transactionHelper, initialOpeningHours, OpeningHours.class);
  }

  @Override
  protected OpeningHours createEmptyOpeningHoursEntity() {
    return new OpeningHours();
  }
}
