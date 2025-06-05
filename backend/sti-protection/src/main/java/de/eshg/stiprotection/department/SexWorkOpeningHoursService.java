/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AuditLogWriter;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.config.SexWorkConfigurationStatusAware;
import de.eshg.stiprotection.persistence.SexWorkOpeningHours;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class SexWorkOpeningHoursService
    extends AbstractStiProtectionOpeningHoursService<SexWorkOpeningHours>
    implements SexWorkConfigurationStatusAware {

  public SexWorkOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      AuditLogWriter auditLogWriter) {
    super(
        entityManager,
        transactionHelper,
        departmentInfoConfig.getOpeningHours().get(Concern.SEX_WORK.name().toLowerCase()),
        auditLogWriter,
        SexWorkOpeningHours.class);
  }

  @Override
  protected SexWorkOpeningHours createEmptyOpeningHoursEntity() {
    return new SexWorkOpeningHours();
  }
}
