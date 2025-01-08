/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.lib.auditlog.config.AuditLogConfig;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.io.IOException;
import java.nio.file.Files;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class AuditLogTestHelperService implements SharedAuditLogTestHelperApi {

  private static final Logger log = LoggerFactory.getLogger(AuditLogTestHelperService.class);

  private final AuditLogArchiving auditLogArchiving;
  private final AuditLogConfig auditLogConfig;
  private final EnvironmentConfig environmentConfig;

  public AuditLogTestHelperService(
      AuditLogArchiving auditLogArchiving,
      AuditLogConfig auditLogConfig,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    this.auditLogArchiving = auditLogArchiving;
    this.auditLogConfig = auditLogConfig;
    this.environmentConfig = environmentConfig;
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    environmentConfig.assertIsNotProduction();
    log.info("Clearing audit log storage directory");
    if (Files.exists(auditLogConfig.getLogOutputDir())) {
      FileUtils.cleanDirectory(auditLogConfig.getLogOutputDir().toFile());
    }
  }

  @Override
  public void runArchivingJob() {
    environmentConfig.assertIsNotProduction();
    auditLogArchiving.runArchivingJob();
  }
}
