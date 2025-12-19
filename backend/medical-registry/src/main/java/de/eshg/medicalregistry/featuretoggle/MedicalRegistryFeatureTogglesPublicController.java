/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.featuretoggle;

import de.eshg.medicalregistry.featuretoggle.api.GetMedicalRegistryFeatureTogglesResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MedicalRegistryFeatureTogglesPublicController.BASE_URL)
@Tag(name = "MedicalRegistryFeatureTogglesPublic")
public class MedicalRegistryFeatureTogglesPublicController {

  public static final String BASE_URL = BaseUrls.MedicalRegistry.FEATURE_TOGGLES_CONTROLLER;

  private final MedicalRegistryFeatureToggle featureToggle;

  public MedicalRegistryFeatureTogglesPublicController(MedicalRegistryFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
  }

  @GetMapping
  public GetMedicalRegistryFeatureTogglesResponse getFeatureToggles() {
    return new GetMedicalRegistryFeatureTogglesResponse(
        featureToggle.getEnabledNewFeatures(), featureToggle.getDisabledOldFeatures());
  }
}
