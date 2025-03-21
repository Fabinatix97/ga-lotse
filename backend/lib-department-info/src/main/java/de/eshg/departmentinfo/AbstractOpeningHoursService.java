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

public abstract class AbstractOpeningHoursService<O extends AbstractOpeningHours>
    extends EshgConfigurationService<O> {
  protected final MandatoryInitialOpeningHours initialOpeningHours;

  public AbstractOpeningHoursService(
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

  @Override
  protected O getInitialConfiguration() {
    O openingHours = createEmptyOpeningHoursEntity();
    openingHours.setDe(initialOpeningHours.de());
    openingHours.setEn(initialOpeningHours.en());
    return openingHours;
  }

  protected abstract O createEmptyOpeningHoursEntity();
}
