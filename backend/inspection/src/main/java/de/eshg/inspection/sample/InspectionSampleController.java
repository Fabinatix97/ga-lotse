/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.sample.api.CreateInspectionSampleRequest;
import de.eshg.inspection.sample.api.GetInspectionSamplesResponse;
import de.eshg.inspection.sample.api.InspectionSampleDto;
import de.eshg.inspection.sample.api.InspectionSampleMeasurementParameterDto;
import de.eshg.inspection.sample.api.UpdateInspectionSampleMeasurementParameterUserAssessmentRequest;
import de.eshg.inspection.sample.api.UpdateInspectionSampleMeasurementParameterValueRequest;
import de.eshg.inspection.sample.api.UpdateInspectionSampleRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = InspectionSampleController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "InspectionSample")
public class InspectionSampleController {

  public static final String BASE_URL =
      BaseUrls.Inspection.INSPECTION_CONTROLLER + "/{inspectionId}/samples";

  private final InspectionSampleService inspectionSampleService;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  public InspectionSampleController(
      InspectionSampleService inspectionSampleService,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.inspectionSampleService = inspectionSampleService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  @GetMapping
  @Operation(summary = "Get all samples of an inspection")
  @Transactional(readOnly = true)
  public GetInspectionSamplesResponse getSamples(@PathVariable("inspectionId") UUID inspectionId) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }

    return inspectionSampleService.getSamples(inspectionId);
  }

  @PostMapping
  @Operation(summary = "Creates a new sample")
  @Transactional
  public InspectionSampleDto createSample(
      @PathVariable("inspectionId") UUID inspectionId,
      @Valid @RequestBody CreateInspectionSampleRequest request) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return inspectionSampleService.createSample(inspectionId, request);
  }

  @PutMapping(path = "/{sampleId}")
  @Operation(summary = "Update a sample")
  @Transactional
  public InspectionSampleDto updateSample(
      @PathVariable("inspectionId") UUID inspectionId,
      @PathVariable("sampleId") UUID sampleId,
      @Valid @RequestBody UpdateInspectionSampleRequest request) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return inspectionSampleService.updateSample(inspectionId, sampleId, request);
  }

  @PostMapping(path = "/{sampleId}/measurement-parameters/{measurementParameterId}/value")
  @Operation(summary = "Update a sample's measurement parameter's value")
  @Transactional
  public InspectionSampleMeasurementParameterDto updateSampleMeasurementParameterValue(
      @PathVariable("inspectionId") UUID inspectionId,
      @PathVariable("sampleId") UUID sampleId,
      @PathVariable("measurementParameterId") UUID measurementParameterId,
      @Valid @RequestBody UpdateInspectionSampleMeasurementParameterValueRequest request) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return inspectionSampleService.updateSampleMeasurementParameterValue(
        inspectionId, sampleId, measurementParameterId, request);
  }

  @PostMapping(path = "/{sampleId}/measurement-parameters/{measurementParameterId}/user-assessment")
  @Operation(summary = "Update a sample's measurement parameter's value")
  @Transactional
  public InspectionSampleMeasurementParameterDto updateSampleMeasurementParameterUserAssessment(
      @PathVariable("inspectionId") UUID inspectionId,
      @PathVariable("sampleId") UUID sampleId,
      @PathVariable("measurementParameterId") UUID measurementParameterId,
      @Valid @RequestBody UpdateInspectionSampleMeasurementParameterUserAssessmentRequest request) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return inspectionSampleService.updateSampleMeasurementParameterUserAssessment(
        inspectionId, sampleId, measurementParameterId, request);
  }

  @DeleteMapping(path = "/{sampleId}")
  @Operation(summary = "Delete a sample")
  @Transactional
  public void deleteSample(
      @PathVariable("inspectionId") UUID inspectionId, @PathVariable("sampleId") UUID sampleId) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    inspectionSampleService.deleteSample(inspectionId, sampleId);
  }

  @DeleteMapping(path = "/{sampleId}/measurement-parameters/{measurementParameterId}")
  @Operation(summary = "Delete a measurement parameter")
  @Transactional
  public void deleteMeasurementParameter(
      @PathVariable("inspectionId") UUID inspectionId,
      @PathVariable("sampleId") UUID sampleId,
      @PathVariable("measurementParameterId") UUID measurementParameterId) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    inspectionSampleService.deleteMeasurementParameter(
        inspectionId, sampleId, measurementParameterId);
  }
}
