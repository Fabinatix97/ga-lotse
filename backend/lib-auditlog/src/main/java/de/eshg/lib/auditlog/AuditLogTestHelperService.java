/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.lib.auditlog.config.AuditLogConfig;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
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

  public AuditLogTestHelperService(
      AuditLogArchiving auditLogArchiving, AuditLogConfig auditLogConfig) {
    this.auditLogArchiving = auditLogArchiving;
    this.auditLogConfig = auditLogConfig;
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    log.info("Clearing audit log storage directory");
    if (Files.exists(auditLogConfig.getLogOutputDir())) {
      FileUtils.cleanDirectory(auditLogConfig.getLogOutputDir().toFile());
    }
  }

  @Override
  public void runArchivingJob() {
    auditLogArchiving.runArchivingJob();
  }
}
