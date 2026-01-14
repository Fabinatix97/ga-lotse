/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.sample.api.AutocompleteActorResponse;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = InspectionSampleActorAutocompleteController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "InspectionSampleActorAutocomplete")
public class InspectionSampleActorAutocompleteController {
  public static final String BASE_URL =
      BaseUrls.Inspection.INSPECTION_CONTROLLER + "/sample-actor-autocomplete";

  private final InspectionSampleService inspectionSampleService;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  public InspectionSampleActorAutocompleteController(
      InspectionSampleService inspectionSampleService,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.inspectionSampleService = inspectionSampleService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  @GetMapping
  @Operation(summary = "Autocomplete actors for taking or evaluating samples")
  @Transactional(readOnly = true)
  public AutocompleteActorResponse autocompleteActor(
      @RequestParam(name = "prefix") String prefix,
      @RequestParam(name = "useLaboratories") boolean useLaboratories) {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
    return inspectionSampleService.getActorAutocomplete(prefix, useLaboratories);
  }
}
