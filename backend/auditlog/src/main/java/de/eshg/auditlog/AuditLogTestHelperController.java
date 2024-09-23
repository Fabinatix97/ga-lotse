/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import de.eshg.lib.auditlog.AuditLogArchiving;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.nio.file.Files;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
@Tag(name = "AuditLogTestHelper")
public class AuditLogTestHelperController implements AuditLogTestHelperApi {

  private static final Logger log = LoggerFactory.getLogger(AuditLogTestHelperController.class);

  private final AuditLogArchiving auditLogArchiving;
  private final AuditLogServiceConfig auditLogServiceConfig;
  private final AuditLogTestHelperService auditLogTestHelperService;

  public AuditLogTestHelperController(
      AuditLogArchiving auditLogArchiving,
      AuditLogServiceConfig auditLogServiceConfig,
      AuditLogTestHelperService auditLogTestHelperService) {
    this.auditLogArchiving = auditLogArchiving;
    this.auditLogServiceConfig = auditLogServiceConfig;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    log.info("Clearing audit log storage directory");
    if (Files.exists(auditLogServiceConfig.getLogStorageDir())) {
      FileUtils.cleanDirectory(auditLogServiceConfig.getLogStorageDir().toFile());
    }
    auditLogTestHelperService.clearAuditLogStorageDirectory();
  }

  @Override
  public void runArchivingJob() {
    auditLogArchiving.runArchivingJob();
  }
}
