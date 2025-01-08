/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.testhelper;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.TestHelperWithDatabaseService;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.io.IOException;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
public class MedicalRegistryTestHelperController extends TestHelperController
    implements SharedAuditLogTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;

  public MedicalRegistryTestHelperController(
      TestHelperWithDatabaseService testHelperWithDatabaseService,
      EnvironmentConfig environmentConfig,
      AuditLogTestHelperService auditLogTestHelperService) {
    super(testHelperWithDatabaseService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    auditLogTestHelperService.clearAuditLogStorageDirectory();
  }

  @Override
  public void runArchivingJob() {
    auditLogTestHelperService.runArchivingJob();
  }
}
