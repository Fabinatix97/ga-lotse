/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperApi;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.TestHelperWithDatabaseService;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class OmsTestHelperController extends TestHelperController
    implements SharedAuditLogTestHelperApi {
  public static final String TEST_POPULATION_PATH = "/population";
  public static final String TEST_POPULATION_URL = TestHelperApi.BASE_URL + TEST_POPULATION_PATH;

  private final TestPopulateProcedureService testPopulateProcedureService;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final AuditLogTestHelperService auditLogTestHelperService;

  public OmsTestHelperController(
      TestHelperWithDatabaseService omsTestHelperService,
      TestPopulateProcedureService testPopulateProcedureService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      AuditLogTestHelperService auditLogTestHelperService,
      EnvironmentConfig environmentConfig) {
    super(omsTestHelperService, environmentConfig);
    this.testPopulateProcedureService = testPopulateProcedureService;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @PostExchange(TEST_POPULATION_PATH + "/procedure")
  @Operation(summary = "Create a procedure and dependent entities")
  public PostPopulateProcedureResponse populateProcedure(
      @Valid @RequestBody PostPopulateProcedureRequest request) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> testPopulateProcedureService.populateProcedure(request));
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
