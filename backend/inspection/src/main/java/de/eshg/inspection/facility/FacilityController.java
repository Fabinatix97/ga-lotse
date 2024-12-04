/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.inspection.facility.api.GetPendingFacilitiesFilterOptionsDto;
import de.eshg.inspection.facility.api.GetPendingFacilitiesPaginationOptionsDto;
import de.eshg.inspection.facility.api.InspAddFacilityRequest;
import de.eshg.inspection.facility.api.InspAddFacilityResponse;
import de.eshg.inspection.facility.api.InspFacilityDto;
import de.eshg.inspection.facility.api.InspLinkBaseFacilityRequest;
import de.eshg.inspection.facility.api.InspLinkBaseFacilityResponse;
import de.eshg.inspection.facility.api.InspPendingFacilitiesOverviewResponse;
import de.eshg.inspection.facility.api.InspUpdateFacilityRequest;
import de.eshg.inspection.facility.export.FacilityExportService;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = FacilityController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Facility")
public class FacilityController {

  public static final String BASE_URL = BaseUrls.Inspection.FACILITY_CONTROLLER;

  static final String BANNED_FACILITIES_EXPORT_FILENAME = "untersagte-Einrichtungen.xlsx";

  private final FacilityService facilityService;
  private final FacilityExportService facilityExportService;

  public FacilityController(
      FacilityService facilityService, FacilityExportService facilityExportService) {
    this.facilityService = facilityService;
    this.facilityExportService = facilityExportService;
  }

  @PostMapping
  @Operation(summary = "Add a new facility")
  @Transactional
  public InspAddFacilityResponse addFacility(@Valid @RequestBody InspAddFacilityRequest request) {
    return facilityService.addFacility(request);
  }

  @PostMapping(value = "/base")
  @Operation(
      summary =
          "Get an existing or create a new inspection facility based on facility of the base module")
  @Transactional
  public InspLinkBaseFacilityResponse linkBaseFacility(
      @Valid @RequestBody InspLinkBaseFacilityRequest request) {
    return facilityService.linkBaseFacility(request);
  }

  @PutMapping(path = "/{id}")
  @Operation(summary = "Updates a facility")
  @Transactional
  public InspFacilityDto updateFacility(
      @PathVariable("id") UUID externalId, @Valid @RequestBody InspUpdateFacilityRequest request) {
    return facilityService.updateFacility(externalId, request);
  }

  @GetMapping(path = "/pending")
  @Operation(summary = "get overview of facilities with pending inspections")
  @Transactional
  public InspPendingFacilitiesOverviewResponse getPendingFacilities(
      @InlineParameterObject @ParameterObject @Valid GetPendingFacilitiesFilterOptionsDto filters,
      @InlineParameterObject @ParameterObject @Valid
          GetPendingFacilitiesPaginationOptionsDto pagination) {
    return facilityService.getPendingFacilities(filters, pagination);
  }

  @GetMapping(path = "/export-banned")
  @ApiResponse(responseCode = "200", description = "Exported banned facilities")
  @Operation(summary = "Export banned facilities")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> exportBannedFacilities() {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(BANNED_FACILITIES_EXPORT_FILENAME)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.APPLICATION_XLSX_VALUE)
        .body(facilityExportService.exportBannedFacilities());
  }

  @GetMapping(path = "/{id}/history")
  @Operation(summary = "get history of inspections for the current facility")
  @Transactional(readOnly = true)
  public InspPendingFacilitiesOverviewResponse getFacilityHistory(
      @PathVariable("id") UUID externalId) {
    return facilityService.getFacilityHistory(externalId);
  }
}
