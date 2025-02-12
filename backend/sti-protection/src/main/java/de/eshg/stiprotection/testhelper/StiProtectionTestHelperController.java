/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.stiprotection.OverdueProceduresNotifier;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.StiProtectionProcedurePopulationRequest;
import de.eshg.stiprotection.api.StiProtectionProcedurePopulationResponse;
import de.eshg.stiprotection.api.TextTemplatePopulationRequest;
import de.eshg.stiprotection.api.TextTemplatePopulationResponse;
import de.eshg.stiprotection.api.texttemplate.TextTemplateDto;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class StiProtectionTestHelperController extends TestHelperController
    implements AuditLogClientTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;
  private final StiProtectionPopulator populator;
  private final TextTemplatePopulator textTemplatePopulator;
  private final OverdueProceduresNotifier overdueProceduresNotifier;

  public StiProtectionTestHelperController(
      StiProtectionTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      StiProtectionPopulator populator,
      TextTemplatePopulator textTemplatePopulator,
      EnvironmentConfig environmentConfig,
      OverdueProceduresNotifier overdueProceduresNotifier) {
    super(testHelperService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.populator = populator;
    this.textTemplatePopulator = textTemplatePopulator;
    this.overdueProceduresNotifier = overdueProceduresNotifier;
  }

  @PostExchange("/population/procedures")
  public StiProtectionProcedurePopulationResponse populateStiProtectionProcedures(
      @Valid @RequestBody StiProtectionProcedurePopulationRequest request) {
    ListWithTotalNumber<CreateProcedureResponse> result =
        populator.populate(request.numberOfEntitiesToPopulate());
    return new StiProtectionProcedurePopulationResponse(
        result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/population/text-templates")
  public TextTemplatePopulationResponse populateTextTemplates(
      @Valid @RequestBody TextTemplatePopulationRequest request) {
    ListWithTotalNumber<TextTemplateDto> result =
        this.textTemplatePopulator.populate(request.numberOfEntitiesToPopulate());
    return new TextTemplatePopulationResponse(result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/notify/overdue-procedures")
  public ResponseEntity<Void> notifyOfOverdueProcedures() {
    overdueProceduresNotifier.runNow();
    return ResponseEntity.ok().build();
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }
}
