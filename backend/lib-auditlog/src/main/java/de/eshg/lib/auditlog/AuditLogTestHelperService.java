/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class AuditLogTestHelperService implements AuditLogClientTestHelperApi {

  private final AuditLogArchiving auditLogArchiving;
  private final EnvironmentConfig environmentConfig;

  public AuditLogTestHelperService(
      AuditLogArchiving auditLogArchiving, EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    this.auditLogArchiving = auditLogArchiving;
    this.environmentConfig = environmentConfig;
  }

  @Override
  public void runAuditLogArchivingJob() {
    environmentConfig.assertIsNotProduction();
    auditLogArchiving.runArchivingJob();
  }
}
