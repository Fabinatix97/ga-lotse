/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.measlesprotection.api.MeaslesProtectionProcedurePopulationResult;
import de.eshg.measlesprotection.api.draft.OpenProcedureResponse;
import de.eshg.measlesprotection.config.MeaslesProtectionFeature;
import de.eshg.measlesprotection.config.MeaslesProtectionFeatureToggle;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class ProtectionProcedureTestHelperController extends TestHelperController
    implements SharedAuditLogTestHelperApi {

  private final ProtectionProcedurePopulator populator;
  private final AuditLogTestHelperService auditLogTestHelperService;
  private final MeaslesProtectionFeatureToggle measlesProtectionFeatureToggle;

  public ProtectionProcedureTestHelperController(
      MeaslesProtectionTestHelperService testHelperService,
      ProtectionProcedurePopulator populator,
      MeaslesProtectionFeatureToggle measlesProtectionFeatureToggle,
      AuditLogTestHelperService auditLogTestHelperService,
      EnvironmentConfig environmentConfig) {
    super(testHelperService, environmentConfig);
    this.populator = populator;
    this.measlesProtectionFeatureToggle = measlesProtectionFeatureToggle;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @PostExchange("/population/procedures")
  public MeaslesProtectionProcedurePopulationResult populateMeaslesProtectionProcedures(
      @Valid @RequestBody PopulationRequest request) {
    ListWithTotalNumber<OpenProcedureResponse> result =
        populator.populate(request.numberOfEntitiesToPopulate());
    return new MeaslesProtectionProcedurePopulationResult(
        result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(
      @PathVariable("featureToEnable") MeaslesProtectionFeature featureToEnable) {
    measlesProtectionFeatureToggle.enableNewFeature(featureToEnable);
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
