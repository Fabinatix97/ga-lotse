/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.domain.OpeningHours;
import de.eshg.config.initialization.MandatoryInitialOpeningHours;
import de.eshg.config.spring.ConditionalOnBusinessModule;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.OPENING_HOURS.name(), toConfigurationStatus(getConfig()));
  }
}
