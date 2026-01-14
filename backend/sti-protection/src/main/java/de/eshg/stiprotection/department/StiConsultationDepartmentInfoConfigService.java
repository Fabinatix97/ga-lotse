/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.department.PublicDepartmentApi;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.departmentinfo.AbstractDepartmentInfoWithBaseModuleFallbackConfigService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.config.HivStiConsultationConfigurationStatusAware;
import de.eshg.stiprotection.persistence.StiConsultationDepartmentInfoConfig;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
public class StiConsultationDepartmentInfoConfigService
    extends AbstractDepartmentInfoWithBaseModuleFallbackConfigService<
        StiConsultationDepartmentInfoConfig>
    implements HivStiConsultationConfigurationStatusAware {

  protected StiConsultationDepartmentInfoConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      PublicDepartmentApi publicDepartmentApi,
      AuditLogWriter auditLogWriter) {
    super(
        entityManager,
        transactionHelper,
        publicDepartmentApi,
        departmentInfoConfig
            .getDepartmentInfo()
            .get(Concern.HIV_STI_CONSULTATION.name().toLowerCase()),
        auditLogWriter,
        StiConsultationDepartmentInfoConfig.class);
  }

  @Override
  protected StiConsultationDepartmentInfoConfig createEmptyDepartmentInfoObject() {
    return new StiConsultationDepartmentInfoConfig();
  }
}
