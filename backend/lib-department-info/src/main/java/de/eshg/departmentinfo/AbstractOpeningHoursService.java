/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.config.EshgConfigurationService;
import de.eshg.departmentinfo.domain.AbstractOpeningHours;
import de.eshg.departmentinfo.initialization.MandatoryInitialOpeningHours;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractOpeningHoursService<O extends AbstractOpeningHours>
    extends EshgConfigurationService<O> {
  protected final MandatoryInitialOpeningHours initialOpeningHours;

  protected AbstractOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MandatoryInitialOpeningHours initialOpeningHours,
      Class<O> configClass) {
    super(entityManager, transactionHelper, configClass);
    this.initialOpeningHours = initialOpeningHours;
  }

  @Override
  public O getConfig() {
    return super.getConfig();
  }

  @Transactional
  public void updateOpeningHours(List<String> de, List<String> en) {
    O config = getConfig();
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
}
