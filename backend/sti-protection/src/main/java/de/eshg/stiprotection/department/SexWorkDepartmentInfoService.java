/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.department.DepartmentApi;
import de.eshg.departmentinfo.AbstractDepartmentInfoWithBaseModuleFallbackService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.SexWorkDepartmentInfo;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
public class SexWorkDepartmentInfoService
    extends AbstractDepartmentInfoWithBaseModuleFallbackService<SexWorkDepartmentInfo> {

  protected SexWorkDepartmentInfoService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      DepartmentApi departmentApi) {
    super(
        entityManager,
        transactionHelper,
        departmentApi,
        departmentInfoConfig.getDepartmentInfo().get(Concern.SEX_WORK.name().toLowerCase()),
        SexWorkDepartmentInfo.class);
  }

  @Override
  protected SexWorkDepartmentInfo createEmptyDepartmentInfoObject() {
    return new SexWorkDepartmentInfo();
  }
}
