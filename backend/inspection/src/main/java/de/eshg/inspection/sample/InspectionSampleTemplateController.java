/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.sample.api.GetInspectionSampleTemplatesResponse;
import de.eshg.inspection.sample.api.InspectionSampleTemplateDto;
import de.eshg.inspection.sample.persistence.InspectionSampleTemplateRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Comparator;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = InspectionSampleTemplateController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "InspectionSampleTemplate")
public class InspectionSampleTemplateController {

  public static final String BASE_URL = BaseUrls.Inspection.INSPECTION_SAMPLE_TEMPLATE_CONTROLLER;

  private final InspectionSampleTemplateRepository inspectionSampleTemplateRepository;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  public InspectionSampleTemplateController(
      InspectionSampleTemplateRepository inspectionSampleTemplateRepository,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.inspectionSampleTemplateRepository = inspectionSampleTemplateRepository;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  @GetMapping
  @Operation(summary = "Get all sample templates")
  @Transactional(readOnly = true)
  public GetInspectionSampleTemplatesResponse getInspectionSampleTemplates() {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return new GetInspectionSampleTemplatesResponse(
        inspectionSampleTemplateRepository.findAll().stream()
            .map(InspectionSampleMapper::mapToDto)
            .sorted(Comparator.comparing(InspectionSampleTemplateDto::name))
            .toList());
  }
}
