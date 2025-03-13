/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.opendata.api.GetFeatureTogglesResponse;
import de.eshg.opendata.config.OpenDataFeatureToggle;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OpenDataFeatureTogglesController.BASE_URL)
@Tag(name = "OpenDataFeatureToggles")
public class OpenDataFeatureTogglesController {

  public static final String BASE_URL = BaseUrls.OpenData.FEATURE_TOGGLES_CONTROLLER;

  private final OpenDataFeatureToggle featureToggle;

  public OpenDataFeatureTogglesController(OpenDataFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetFeatureTogglesResponse getFeatureToggles() {
    return new GetFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
