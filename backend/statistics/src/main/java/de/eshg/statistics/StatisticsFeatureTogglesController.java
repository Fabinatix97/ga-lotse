/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.GetFeatureTogglesResponse;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(StatisticsFeatureTogglesController.BASE_URL)
@Tag(name = "StatisticsFeatureToggles")
public class StatisticsFeatureTogglesController {

  public static final String BASE_URL = BaseUrls.Statistics.FEATURE_TOGGLES_CONTROLLER;

  private final StatisticsFeatureToggle featureToggle;

  public StatisticsFeatureTogglesController(StatisticsFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetFeatureTogglesResponse getFeatureToggles() {
    return new GetFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
