/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.config.domain.DepartmentInfoConfig;
import de.eshg.config.initialization.OptionalInitialDepartmentInfo;
import de.eshg.config.spring.ConditionalOnBusinessModule;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnBusinessModule
@ConditionalOnMissingBean(AbstractDepartmentInfoConfigService.class)
@EnableConfigurationProperties(OptionalInitialDepartmentInfo.class)
public class DepartmentInfoConfigService
    extends AbstractDepartmentInfoWithBaseModuleFallbackConfigService<DepartmentInfoConfig> {

  public DepartmentInfoConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentApi departmentApi,
      OptionalInitialDepartmentInfo optionalInitialDepartmentInfo) {
    super(
        entityManager,
        transactionHelper,
        departmentApi,
        optionalInitialDepartmentInfo,
        DepartmentInfoConfig.class);
  }

  @Override
  protected DepartmentInfoConfig createEmptyDepartmentInfoObject() {
    return new DepartmentInfoConfig();
  }
}
