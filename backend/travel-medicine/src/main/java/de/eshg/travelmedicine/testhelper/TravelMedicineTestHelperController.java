/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import de.eshg.auditlog.AuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperApi;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.testhelper.api.PostPopulateAdministrativeResponse;
import de.eshg.travelmedicine.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.travelmedicine.testhelper.api.PostPopulateProcedureResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class TravelMedicineTestHelperController extends TestHelperController
    implements AuditLogTestHelperApi {

  public static final String TEST_POPULATION_PATH = "/population";
  public static final String TEST_POPULATION_URL = TestHelperApi.BASE_URL + TEST_POPULATION_PATH;

  private final TravelMedicineFeatureToggle travelMedicineFeatureToggle;
  private final TestPopulateAdministrativeService testPopulateAdministrativeService;
  private final TestPopulateProcedureService testPopulateProcedureService;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final AuditLogTestHelperService auditLogTestHelperService;

  public TravelMedicineTestHelperController(
      TravelMedicineTestHelperService travelMedicineTestHelperService,
      TravelMedicineFeatureToggle travelMedicineFeatureToggle,
      TestPopulateAdministrativeService testPopulateAdministrativeService,
      TestPopulateProcedureService testPopulateProcedureService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      AuditLogTestHelperService auditLogTestHelperService) {
    super(travelMedicineTestHelperService);
    this.travelMedicineFeatureToggle = travelMedicineFeatureToggle;
    this.testPopulateAdministrativeService = testPopulateAdministrativeService;
    this.testPopulateProcedureService = testPopulateProcedureService;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(
      @PathVariable("featureToEnable") TravelMedicineFeature featureToEnable) {
    travelMedicineFeatureToggle.enableNewFeature(featureToEnable);
  }

  @PostExchange(TEST_POPULATION_PATH + "/administrative")
  @Operation(summary = "Create administrative entities")
  public PostPopulateAdministrativeResponse populateAdministrative() {
    return testPopulateAdministrativeService.populateAdministrative();
  }

  @PostExchange(TEST_POPULATION_PATH + "/procedure")
  @Operation(summary = "Create a procedure and dependent entities")
  public PostPopulateProcedureResponse populateProcedure(
      @Valid @RequestBody PostPopulateProcedureRequest populateProcedureRequest) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> testPopulateProcedureService.populateProcedure(populateProcedureRequest));
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
