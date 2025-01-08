/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.feature;

import de.eshg.inspection.feature.api.GetInspectionFeatureTogglesResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(InspectionFeatureTogglesController.BASE_URL)
@Tag(name = "InspectionFeatureToggles")
public class InspectionFeatureTogglesController {

  public static final String BASE_URL = BaseUrls.Inspection.FEATURE_TOGGLES_CONTROLLER;

  private final InspectionFeatureToggle featureToggle;

  public InspectionFeatureTogglesController(InspectionFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetInspectionFeatureTogglesResponse getFeatureToggles() {
    return new GetInspectionFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
