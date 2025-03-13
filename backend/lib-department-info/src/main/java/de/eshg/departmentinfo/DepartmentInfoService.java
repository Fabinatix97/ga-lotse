/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.departmentinfo.domain.DepartmentInfo;
import de.eshg.departmentinfo.initialization.OptionalInitialDepartmentInfo;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnMissingBean(
    value = AbstractDepartmentInfoService.class,
    ignored = DepartmentInfoService.class)
@EnableConfigurationProperties(OptionalInitialDepartmentInfo.class)
public class DepartmentInfoService
    extends AbstractDepartmentInfoWithBaseModuleFallbackService<DepartmentInfo> {

  public DepartmentInfoService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentApi departmentApi,
      OptionalInitialDepartmentInfo optionalInitialDepartmentInfo) {
    super(
        entityManager,
        transactionHelper,
        departmentApi,
        optionalInitialDepartmentInfo,
        DepartmentInfo.class);
  }

  @Override
  protected DepartmentInfo createEmptyDepartmentInfoObject() {
    return new DepartmentInfo();
  }
}
