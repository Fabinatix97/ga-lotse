/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment;

import de.eshg.officialmedicalservice.assessment.api.AssessmentDetailsDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentStatusDto;
import de.eshg.officialmedicalservice.assessment.api.CreateAssessmentDto;
import de.eshg.officialmedicalservice.assessment.api.GetAllAssessmentsResponse;
import de.eshg.officialmedicalservice.assessment.api.UpdateAssessmentContentRequest;
import de.eshg.officialmedicalservice.assessment.api.UpdateAssessmentRecipientTypeRequest;
import de.eshg.officialmedicalservice.assessment.api.UpdateAssessmentResultRequest;
import de.eshg.officialmedicalservice.assessment.api.UpdateAssessmentSummaryRequest;
import de.eshg.officialmedicalservice.assessment.api.UpdateAssessmentTitleAndTypeRequest;
import de.eshg.officialmedicalservice.assessment.api.UpdateLegalBasisDto;
import de.eshg.officialmedicalservice.assessment.api.UpdatePreviewReaderDto;
import de.eshg.officialmedicalservice.assessment.api.UpdateSourcesDto;
import de.eshg.officialmedicalservice.feature.OmsFeature;
import de.eshg.officialmedicalservice.feature.OmsFeatureToggle;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
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
    path = OmsMedicalAssessmentController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "OmsMedicalAssessment")
public class OmsMedicalAssessmentController {
  public static final String BASE_URL =
      BaseUrls.OfficialMedicalService.EMPLOYEE_API + BaseUrls.OfficialMedicalService.ASSESSMENT_API;

  private final OmsMedicalAssessmentService omsMedicalAssessmentService;
  private final OmsFeatureToggle omsFeatureToggle;

  public OmsMedicalAssessmentController(
      OmsMedicalAssessmentService omsMedicalAssessmentService, OmsFeatureToggle omsFeatureToggle) {
    this.omsMedicalAssessmentService = omsMedicalAssessmentService;
    this.omsFeatureToggle = omsFeatureToggle;
  }

  @GetMapping("/by-procedure/{id}")
  @Operation(summary = "Get all Assessments related to a specific procedure")
  public GetAllAssessmentsResponse getAssessmentsByProcedureExternalId(
      @PathVariable("id") UUID procedureExternalId) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    return new GetAllAssessmentsResponse(
        omsMedicalAssessmentService.getAssessmentsByProcedure(procedureExternalId));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get a specific Assessment")
  public AssessmentDetailsDto getAssessmentByExternalId(@PathVariable("id") UUID externalId) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    return omsMedicalAssessmentService.getAssessmentById(externalId);
  }

  @PostMapping()
  @Operation(summary = "Create a new Assessment linked to a specific procedure")
  public UUID createAssessment(@Valid @RequestBody CreateAssessmentDto createAssessmentDto) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    return omsMedicalAssessmentService.createAssessment(createAssessmentDto);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete an Assessment")
  public void deleteAssessment(@PathVariable("id") UUID externalId) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.deleteAssessment(externalId);
  }

  @PutMapping("/{id}/title-and-type")
  @Operation(summary = "Update Assessment title and type")
  public void updateAssessmentTitleAndType(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateAssessmentTitleAndTypeRequest request) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentTitleAndType(
        externalId, request.title(), request.assessmentType());
  }

  @PutMapping("/{id}/summary")
  @Operation(summary = "Update Assessment content")
  public void updateAssessmentSummary(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateAssessmentSummaryRequest request) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentSummary(externalId, request.summary());
  }

  @PutMapping("/{id}/content")
  @Operation(summary = "Update Assessment content")
  public void updateAssessmentContent(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateAssessmentContentRequest request) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentContent(
        externalId, request.jsonContent(), request.htmlContent());
  }

  @PutMapping("/{id}/sources")
  @Operation(summary = "Update Assessment sources")
  public void updateAssessmentSources(
      @PathVariable("id") UUID externalId, @Valid @RequestBody UpdateSourcesDto newSources) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentSources(externalId, newSources);
  }

  @PutMapping("/{id}/legal-basis")
  @Operation(summary = "Update Assessment legal basis")
  public void updateAssessmentLegalBasis(
      @PathVariable("id") UUID externalId, @Valid @RequestBody UpdateLegalBasisDto newLegalBasis) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentLegalBasis(externalId, newLegalBasis);
  }

  @PutMapping("/{id}/preview-reader")
  @Operation(summary = "Update Assessment preview readers")
  public void updateAssessmentPreviewReaders(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdatePreviewReaderDto newPreviewReaders) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentPreviewReader(externalId, newPreviewReaders);
  }

  @PutMapping("/{id}/status/open")
  @Operation(summary = "Update Assessment status to open")
  public void updateAssessmentStatusToOpen(@PathVariable("id") UUID externalId) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentStatus(externalId, AssessmentStatusDto.OPEN);
  }

  @PutMapping("/{id}/status/finish")
  @Operation(summary = "Update Assessment status to finished")
  public void updateAssessmentStatusToFinished(@PathVariable("id") UUID externalId) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentStatus(externalId, AssessmentStatusDto.FINISHED);
  }

  @PutMapping("/{id}/status/publish")
  @Operation(summary = "Update Assessment status to published")
  public void updateAssessmentStatusToPublished(@PathVariable("id") UUID externalId) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentStatus(externalId, AssessmentStatusDto.PUBLISHED);
  }

  @PutMapping("/{id}/result")
  @Operation(summary = "Update Assessment result")
  public void updateAssessmentResult(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateAssessmentResultRequest request) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentResult(externalId, request.result());
  }

  @PutMapping("/{id}/recipient")
  @Operation(summary = "Update Assessment recipient type")
  public void updateAssessmentRecipient(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateAssessmentRecipientTypeRequest request) {
    omsFeatureToggle.assertNewFeatureIsEnabled(OmsFeature.ASSESSMENT);

    omsMedicalAssessmentService.updateAssessmentRecipientType(
        externalId, request.recipientTypeDto());
  }
}
