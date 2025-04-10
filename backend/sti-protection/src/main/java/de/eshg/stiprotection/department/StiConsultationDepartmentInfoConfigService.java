/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.department.DepartmentApi;
import de.eshg.config.departmentinfo.AbstractDepartmentInfoWithBaseModuleFallbackConfigService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.StiConsultationDepartmentInfoConfig;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
public class StiConsultationDepartmentInfoConfigService
    extends AbstractDepartmentInfoWithBaseModuleFallbackConfigService<
        StiConsultationDepartmentInfoConfig> {

  protected StiConsultationDepartmentInfoConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      DepartmentApi departmentApi) {
    super(
        entityManager,
        transactionHelper,
        departmentApi,
        departmentInfoConfig
            .getDepartmentInfo()
            .get(Concern.HIV_STI_CONSULTATION.name().toLowerCase()),
        StiConsultationDepartmentInfoConfig.class);
  }

  @Override
  protected StiConsultationDepartmentInfoConfig createEmptyDepartmentInfoObject() {
    return new StiConsultationDepartmentInfoConfig();
  }
}
