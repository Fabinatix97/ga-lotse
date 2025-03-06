/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.SexWorkOpeningHours;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class SexWorkOpeningHoursService
    extends AbstractStiProtectionOpeningHoursService<SexWorkOpeningHours> {
  public SexWorkOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig) {
    super(
        entityManager,
        transactionHelper,
        departmentInfoConfig.getOpeningHours().get(Concern.SEX_WORK.name().toLowerCase()),
        SexWorkOpeningHours.class);
  }

  @Override
  protected SexWorkOpeningHours createEmptyOpeningHoursEntity() {
    return new SexWorkOpeningHours();
  }
}
