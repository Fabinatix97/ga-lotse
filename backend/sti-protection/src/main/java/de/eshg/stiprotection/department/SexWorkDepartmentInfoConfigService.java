/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.department.PublicDepartmentApi;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.departmentinfo.AbstractDepartmentInfoWithBaseModuleFallbackConfigService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.SexWorkDepartmentInfoConfig;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
@ConfigConcernQualifier(concern = Concern.SEX_WORK)
public class SexWorkDepartmentInfoConfigService
    extends AbstractDepartmentInfoWithBaseModuleFallbackConfigService<SexWorkDepartmentInfoConfig> {

  protected SexWorkDepartmentInfoConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig,
      PublicDepartmentApi publicDepartmentApi,
      AuditLogWriter auditLogWriter) {
    super(
        entityManager,
        transactionHelper,
        publicDepartmentApi,
        departmentInfoConfig.getDepartmentInfo().get(Concern.SEX_WORK.name().toLowerCase()),
        auditLogWriter,
        SexWorkDepartmentInfoConfig.class);
  }

  @Override
  protected SexWorkDepartmentInfoConfig createEmptyDepartmentInfoObject() {
    return new SexWorkDepartmentInfoConfig();
  }
}
