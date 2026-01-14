/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import de.eshg.lib.auditlog.AuditLogArchiving;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.TestHelperWithDatabaseService;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.io.IOException;
import java.nio.file.Files;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
public class AuditLogServiceTestHelperController extends TestHelperController
    implements AuditLogServiceTestHelperApi, AuditLogClientTestHelperApi {

  private static final Logger log =
      LoggerFactory.getLogger(AuditLogServiceTestHelperController.class);

  private final AuditLogArchiving auditLogArchiving;
  private final AuditLogServiceConfig auditLogServiceConfig;

  public AuditLogServiceTestHelperController(
      TestHelperWithDatabaseService testHelperWithDatabaseService,
      EnvironmentConfig environmentConfig,
      AuditLogArchiving auditLogArchiving,
      AuditLogServiceConfig auditLogServiceConfig) {
    super(testHelperWithDatabaseService, environmentConfig);
    this.auditLogArchiving = auditLogArchiving;
    this.auditLogServiceConfig = auditLogServiceConfig;
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    log.info("Clearing audit log storage directory");
    if (Files.exists(auditLogServiceConfig.getLogStorageDir())) {
      FileUtils.cleanDirectory(auditLogServiceConfig.getLogStorageDir().toFile());
    }
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogArchiving.runArchivingJob();
  }
}
