/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.inspection.checklist.persistence.ChecklistRepository;
import de.eshg.inspection.config.InspectionPropertiesConfigService;
import de.eshg.inspection.config.api.FacilityFileNumberMethodDto;
import de.eshg.inspection.config.mapper.InspectionPropertiesConfigMapper;
import de.eshg.inspection.config.persistence.FacilityFileNumberMethod;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfigurationProvider;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.testhelper.api.TeisDataCreationModeDto;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
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
  private final InspectionPropertiesConfigService inspectionPropertiesConfigService;
  private final InspectionPropertiesConfigMapper inspectionPropertiesConfigMapper;
  private final TeisDataPopulator teisDataPopulator;

  public InspectionTestHelperController(
      DefaultTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      InspectionFeatureToggle inspectionFeatureToggle,
      EnvironmentConfig environmentConfig,
      ChecklistRepository checklistRepository,
      InspectionPropertiesConfigService inspectionPropertiesConfigService,
      InspectionPropertiesConfigMapper inspectionPropertiesConfigMapper,
      TeisDataPopulator teisDataPopulator) {
    super(testHelperService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.checklistRepository = checklistRepository;
    this.inspectionPropertiesConfigService = inspectionPropertiesConfigService;
    this.inspectionPropertiesConfigMapper = inspectionPropertiesConfigMapper;
    this.teisDataPopulator = teisDataPopulator;
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

  @PostExchange("/file-number-method")
  public void setFileNumberMethod(
      @RequestParam(name = "method") FacilityFileNumberMethodDto method) {
    inspectionPropertiesConfigService.updateConfiguration(
        new InspectionPropertiesConfigurationProvider() {
          @Override
          public FacilityFileNumberMethod getFacilityFileNumberMethod() {
            return inspectionPropertiesConfigMapper.toDomainType(method);
          }
        });
  }

  @PostExchange("/recreate-teis-data")
  @Transactional
  public void recreateTeisData(@RequestParam(name = "mode") TeisDataCreationModeDto mode) {
    teisDataPopulator.recreateTeisData(mode);
  }
}
