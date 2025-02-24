/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.inspection.checklist.persistence.ChecklistRepository;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class InspectionTestHelperController extends TestHelperController
    implements AuditLogClientTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;
  private final InspectionFeatureToggle inspectionFeatureToggle;
  private final ChecklistRepository checklistRepository;

  public InspectionTestHelperController(
      DefaultTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      InspectionFeatureToggle inspectionFeatureToggle,
      EnvironmentConfig environmentConfig,
      ChecklistRepository checklistRepository) {
    super(testHelperService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.checklistRepository = checklistRepository;
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(@PathVariable("featureToEnable") InspectionFeature featureToEnable) {
    inspectionFeatureToggle.enableNewFeature(featureToEnable);
  }

  @DeleteExchange("/enabled-new-features/{featureToDisable}")
  public void disableNewFeature(
      @PathVariable("featureToDisable") InspectionFeature featureToDisable) {
    inspectionFeatureToggle.disableNewFeature(featureToDisable);
  }

  @PostExchange("/checklists/make-corrupt")
  @Transactional
  public void makeChecklistsCorrupt() {
    checklistRepository.makeChecklistsCorruptForTestHelper();
  }
}
