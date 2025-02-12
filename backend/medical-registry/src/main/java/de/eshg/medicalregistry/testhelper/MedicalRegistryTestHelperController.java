/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.medicalregistry.featuretoggle.MedicalRegistryFeature;
import de.eshg.medicalregistry.featuretoggle.MedicalRegistryFeatureToggle;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.TestHelperWithDatabaseService;
import de.eshg.testhelper.environment.EnvironmentConfig;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class MedicalRegistryTestHelperController extends TestHelperController
    implements AuditLogClientTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;
  private final MedicalRegistryFeatureToggle medicalRegistryFeatureToggle;

  public MedicalRegistryTestHelperController(
      TestHelperWithDatabaseService testHelperWithDatabaseService,
      EnvironmentConfig environmentConfig,
      AuditLogTestHelperService auditLogTestHelperService,
      MedicalRegistryFeatureToggle medicalRegistryFeatureToggle) {
    super(testHelperWithDatabaseService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.medicalRegistryFeatureToggle = medicalRegistryFeatureToggle;
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(
      @PathVariable("featureToEnable") MedicalRegistryFeature featureToEnable) {
    medicalRegistryFeatureToggle.enableNewFeature(featureToEnable);
  }

  @DeleteExchange("/enabled-new-features/{featureToDisable}")
  public void disableNewFeature(
      @PathVariable("featureToDisable") MedicalRegistryFeature featureToDisable) {
    medicalRegistryFeatureToggle.disableNewFeature(featureToDisable);
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }
}
