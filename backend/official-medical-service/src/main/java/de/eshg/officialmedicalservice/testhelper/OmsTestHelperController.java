/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateAdministrativeResponse;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperApi;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class OmsTestHelperController extends TestHelperController
    implements AuditLogClientTestHelperApi {
  public static final String TEST_POPULATION_PATH = "/population";
  public static final String TEST_POPULATION_URL = TestHelperApi.BASE_URL + TEST_POPULATION_PATH;

  private final TestPopulateProcedureService testPopulateProcedureService;
  private final TestPopulateAdministrativeService testPopulateAdministrativeService;
  private final AuditLogTestHelperService auditLogTestHelperService;

  public OmsTestHelperController(
      DefaultTestHelperService testHelperService,
      TestPopulateProcedureService testPopulateProcedureService,
      TestPopulateAdministrativeService testPopulateAdministrativeService,
      AuditLogTestHelperService auditLogTestHelperService,
      EnvironmentConfig environmentConfig) {
    super(testHelperService, environmentConfig);
    this.testPopulateProcedureService = testPopulateProcedureService;
    this.testPopulateAdministrativeService = testPopulateAdministrativeService;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @PostExchange(TEST_POPULATION_PATH + "/administrative")
  @Operation(summary = "Create administrative entities")
  public PostPopulateAdministrativeResponse populateAdministrative() {
    return testPopulateAdministrativeService.populateAdministrative();
  }

  @PostExchange(TEST_POPULATION_PATH + "/procedure")
  @Operation(summary = "Create a procedure and dependent entities")
  public PostPopulateProcedureResponse populateProcedure(
      @Valid @RequestBody PostPopulateProcedureRequest request) {
    return testPopulateProcedureService.populateProcedure(request);
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }
}
