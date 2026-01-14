/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.GetFeatureTogglesResponse;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SchoolEntryFeatureTogglesController.BASE_URL)
@Tag(name = "SchoolEntryFeatureToggles")
public class SchoolEntryFeatureTogglesController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.FEATURE_TOGGLES_CONTROLLER;

  private final SchoolEntryFeatureToggle featureToggle;

  public SchoolEntryFeatureTogglesController(SchoolEntryFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetFeatureTogglesResponse getFeatureToggles() {
    return new GetFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
