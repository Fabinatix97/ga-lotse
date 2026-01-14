/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AuditLogWriter;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.config.HivStiConsultationConfigurationStatusAware;
import de.eshg.stiprotection.persistence.StiConsultationOpeningHours;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class StiConsultationOpeningHoursService
    extends AbstractStiProtectionOpeningHoursService<StiConsultationOpeningHours>
    implements HivStiConsultationConfigurationStatusAware {

  public StiConsultationOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      AuditLogWriter auditLogWriter) {
    super(
        entityManager,
        transactionHelper,
        departmentInfoConfig
            .getOpeningHours()
            .get(Concern.HIV_STI_CONSULTATION.name().toLowerCase()),
        auditLogWriter,
        StiConsultationOpeningHours.class);
  }

  @Override
  protected StiConsultationOpeningHours createEmptyOpeningHoursEntity() {
    return new StiConsultationOpeningHours();
  }
}
