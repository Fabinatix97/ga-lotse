/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import de.eshg.auditlog.AuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.StiProtectionProcedurePopulationRequest;
import de.eshg.stiprotection.api.StiProtectionProcedurePopulationResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.TestHelperService;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class StiProtectionTestHelperController extends TestHelperController
    implements AuditLogTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;
  private final StiProtectionPopulator populator;

  public StiProtectionTestHelperController(
      TestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      StiProtectionPopulator populator) {
    super(testHelperService);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.populator = populator;
  }

  @PostExchange("/population/procedures")
  public StiProtectionProcedurePopulationResponse populateStiProtectionProcedures(
      @Valid @RequestBody StiProtectionProcedurePopulationRequest request) {
    ListWithTotalNumber<CreateProcedureResponse> result =
        populator.populate(request.numberOfEntitiesToPopulate());
    return new StiProtectionProcedurePopulationResponse(
        result.entities(), result.totalNumberOfElements());
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
