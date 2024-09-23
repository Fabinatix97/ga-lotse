/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.measlesprotection.api.GetFeatureTogglesResponse;
import de.eshg.measlesprotection.config.MeaslesProtectionFeatureToggle;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MeaslesProtectionFeatureTogglesController.BASE_URL)
@Tag(name = "MeaslesProtectionFeatureToggles")
public class MeaslesProtectionFeatureTogglesController {

  public static final String BASE_URL = BaseUrls.MeaslesProtection.FEATURE_TOGGLES_CONTROLLER;

  private final MeaslesProtectionFeatureToggle featureToggle;

  public MeaslesProtectionFeatureTogglesController(MeaslesProtectionFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetFeatureTogglesResponse getFeatureToggles() {
    return new GetFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
