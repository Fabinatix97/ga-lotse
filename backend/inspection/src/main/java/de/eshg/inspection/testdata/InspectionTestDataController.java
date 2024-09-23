/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testdata;

import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.inspection.testhelper.ChecklistDefinitionTestDataProvider;
import de.eshg.inspection.testhelper.FacilityTestDataProvider;
import de.eshg.inspection.testhelper.InspectionTestDataProvider;
import de.eshg.inspection.testhelper.api.CreateTestCLDResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import net.datafaker.Faker;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
@Tag(name = "InspectionTestData")
public class InspectionTestDataController {

  public static final String BASE_URL = BaseUrls.Inspection.INSPECTION_TEST_DATA_CONTROLLER;

  private final InspectionTestDataService inspectionTestDataService;
  private final ChecklistDefinitionTestDataProvider cldTestDataProvider;
  private final FacilityTestDataProvider facilityTestDataProvider;
  private final InspectionTestDataProvider inspectionTestDataProvider;

  public InspectionTestDataController(
      InspectionTestDataService inspectionTestDataService,
      ChecklistDefinitionTestDataProvider cldTestDataProvider,
      FacilityTestDataProvider facilityTestDataProvider,
      InspectionTestDataProvider inspectionTestDataProvider) {
    this.inspectionTestDataService = inspectionTestDataService;
    this.cldTestDataProvider = cldTestDataProvider;
    this.facilityTestDataProvider = facilityTestDataProvider;
    this.inspectionTestDataProvider = inspectionTestDataProvider;
  }

  /**
   * Test method to download some OpenStreetMap *.osm.pbf files from the classpath.
   *
   * <p>See inspection/src/main/resources/de/eshg/inspection/facility/websearch/README.md
   */
  @GetExchange(value = InspectionTestDataController.BASE_URL + "/osm/test-data/{filename}")
  @Operation(
      summary = "Test method to download some OpenStreetMap *.osm.pbf files",
      responses =
          @ApiResponse(
              responseCode = "200",
              content =
                  @Content(
                      mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
                      schema = @Schema(format = "binary"))))
  @SuppressWarnings("unused")
  public ResponseEntity<Resource> downloadOsmTestData(@PathVariable("filename") String filename)
      throws IOException {
    return inspectionTestDataService.downloadOsmTestData(filename);
  }

  @PostExchange(InspectionTestDataController.BASE_URL + "/checklists/definitions/test-data")
  @Operation(summary = "Create test-data for checklist definitions (CLDs)")
  @Transactional
  @SuppressWarnings("unused")
  public CreateTestCLDResponse createTestCLD() {
    List<ChecklistDefinitionDto> clds = cldTestDataProvider.createTestCLDs();
    return new CreateTestCLDResponse(clds);
  }

  @PostExchange(InspectionTestDataController.BASE_URL + "/inspections/test-data")
  @Operation(summary = "Create test data for inspections")
  @Transactional
  public void createTestData() {
    Faker faker = new Faker();
    for (int i = 0; i < 6; i++) {
      InspectionDto response = facilityTestDataProvider.createTestFacilityAndStartInsp(i);
      inspectionTestDataProvider.prepareTestInspection(response.externalId(), faker, i);
    }
  }
}
