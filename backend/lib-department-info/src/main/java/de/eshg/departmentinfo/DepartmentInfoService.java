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
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnMissingBean(
    value = AbstractDepartmentInfoService.class,
    ignored = DepartmentInfoService.class)
public class DepartmentInfoService
    extends AbstractDepartmentInfoWithBaseModuleFallbackService<DepartmentInfo> {

  public static final String DEFAULT_PROPERTY_PREFIX = "de.eshg.department-info";

  public DepartmentInfoService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentApi departmentApi,
      Environment environment) {
    super(
        entityManager,
        transactionHelper,
        departmentApi,
        getInitialPropertiesGracefully(environment),
        DepartmentInfo.class);
  }

  private static OptionalInitialDepartmentInfo getInitialPropertiesGracefully(
      Environment environment) {
    return Binder.get(environment)
        .bind(DEFAULT_PROPERTY_PREFIX, OptionalInitialDepartmentInfo.class)
        .orElseGet(OptionalInitialDepartmentInfo::new);
  }

  @Override
  protected DepartmentInfo createEmptyDepartmentInfoObject() {
    return new DepartmentInfo();
  }
}
