/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.department.DepartmentApi;
import de.eshg.departmentinfo.AbstractDepartmentInfoWithBaseModuleFallbackConfigService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.SexWorkDepartmentInfoConfig;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
public class SexWorkDepartmentInfoConfigService
    extends AbstractDepartmentInfoWithBaseModuleFallbackConfigService<SexWorkDepartmentInfoConfig> {

  protected SexWorkDepartmentInfoConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      DepartmentApi departmentApi) {
    super(
        entityManager,
        transactionHelper,
        departmentApi,
        departmentInfoConfig.getDepartmentInfo().get(Concern.SEX_WORK.name().toLowerCase()),
        SexWorkDepartmentInfoConfig.class);
  }

  @Override
  protected SexWorkDepartmentInfoConfig createEmptyDepartmentInfoObject() {
    return new SexWorkDepartmentInfoConfig();
  }
}
