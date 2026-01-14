/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.featuretoggle;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.featuretoggle.api.GetTravelMedicineFeatureTogglesResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TravelMedicineFeatureTogglesPublicController.BASE_URL)
@Tag(name = "TravelMedicineFeatureTogglesPublic")
public class TravelMedicineFeatureTogglesPublicController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.FEATURE_TOGGLES_CONTROLLER;

  private final TravelMedicineFeatureToggle featureToggle;

  public TravelMedicineFeatureTogglesPublicController(TravelMedicineFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetTravelMedicineFeatureTogglesResponse getFeatureToggles() {
    return new GetTravelMedicineFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
