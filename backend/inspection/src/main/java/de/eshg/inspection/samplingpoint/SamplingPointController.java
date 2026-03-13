/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.samplingpoint;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.samplingpoint.api.CreateSamplingPointRequest;
import de.eshg.inspection.samplingpoint.api.GetFacilitiesForSamplingPointsResponse;
import de.eshg.inspection.samplingpoint.api.GetSamplingPointsResponse;
import de.eshg.inspection.samplingpoint.api.SamplingPointDto;
import de.eshg.inspection.samplingpoint.api.UpdateSamplingPointRequest;
import de.eshg.inspection.util.StringUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.apache.logging.log4j.util.Strings;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = SamplingPointController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "SamplingPoint")
public class SamplingPointController {

  public static final String BASE_URL = BaseUrls.Inspection.SAMPLING_POINTS;
  private final InspectionFeatureToggle inspectionFeatureToggle;
  private final SamplingPointService samplingPointService;

  public SamplingPointController(
      InspectionFeatureToggle inspectionFeatureToggle, SamplingPointService samplingPointService) {
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.samplingPointService = samplingPointService;
  }

  @GetMapping
  @Operation(summary = "Get all sampling points with prefix")
  public GetSamplingPointsResponse getSamplingPoints(
      @RequestParam("namePrefix") @Nullable String namePrefix,
      @RequestParam("facilityId") @Nullable UUID facilityId) {

    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }

    String prefix =
        Strings.isBlank(namePrefix) ? "" : StringUtil.prepareStringForPrefixLike(namePrefix, false);

    List<SamplingPointDto> samplingPointDtos =
        facilityId == null
            ? samplingPointService.getAllSamplingPoints(prefix)
            : samplingPointService.getSamplingPointsFor(facilityId, prefix);

    return new GetSamplingPointsResponse(samplingPointDtos);
  }

  @PostMapping
  @Operation(summary = "Creates a sampling point")
  @Transactional
  public SamplingPointDto createSamplingPoint(
      @Valid @RequestBody CreateSamplingPointRequest request) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return samplingPointService.createSamplingPoint(request);
  }

  @PutMapping(path = "/{samplingPointId}")
  @Operation(summary = "Update a sampling point")
  @Transactional
  public SamplingPointDto updateSamplingPoint(
      @PathVariable("samplingPointId") UUID samplingPointId,
      @Valid @RequestBody UpdateSamplingPointRequest request) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return samplingPointService.updateSamplingPoint(samplingPointId, request);
  }

  @GetMapping("/facilities")
  @Operation(summary = "Get all facilityFileStates that can have sampling points added to them")
  @Transactional(readOnly = true)
  public GetFacilitiesForSamplingPointsResponse getFacilities() {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }

    return samplingPointService.getFacilities();
  }
}
