/*
 * Copyright 2024 cronn GmbH
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
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class MedicalRegistryTestHelperController extends TestHelperController
    implements SharedAuditLogTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;
  private final MedicalRegistryTestHelperService medicalRegistryTestHelperService;

  public MedicalRegistryTestHelperController(
      TestHelperWithDatabaseService testHelperWithDatabaseService,
      EnvironmentConfig environmentConfig,
      AuditLogTestHelperService auditLogTestHelperService,
      MedicalRegistryTestHelperService medicalRegistryTestHelperService) {
    super(testHelperWithDatabaseService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.medicalRegistryTestHelperService = medicalRegistryTestHelperService;
  }

  @Transactional
  @PostExchange("/medical-registry-entries/{procedureId}/close")
  public void closeProcedure(@PathVariable("procedureId") UUID procedureId) {
    medicalRegistryTestHelperService.closeProcedure(procedureId);
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
