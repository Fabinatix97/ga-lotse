/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.feature;

import de.eshg.officialmedicalservice.feature.api.GetOmsFeatureTogglesResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OmsFeatureTogglesController.BASE_URL)
@Tag(name = "OmsFeatureToggles")
public class OmsFeatureTogglesController {

  public static final String BASE_URL = BaseUrls.OfficialMedicalService.FEATURE_TOGGLES_CONTROLLER;

  private final OmsFeatureToggle featureToggle;

  public OmsFeatureTogglesController(OmsFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetOmsFeatureTogglesResponse getFeatureToggles() {
    return new GetOmsFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
