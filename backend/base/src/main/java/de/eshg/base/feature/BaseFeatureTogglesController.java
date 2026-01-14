/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.feature;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "BaseFeatureToggles")
public class BaseFeatureTogglesController implements BaseFeatureTogglesApi {
  private final BaseFeatureToggle baseFeatureToggle;

  public BaseFeatureTogglesController(BaseFeatureToggle baseFeatureToggle) {
    this.baseFeatureToggle = baseFeatureToggle;
  }

  @Override
  public GetBaseFeatureTogglesResponse getFeatureToggles() {
    return new GetBaseFeatureTogglesResponse(
        baseFeatureToggle.getEnabledNewFeatures(), baseFeatureToggle.getDisabledOldFeatures());
  }
}
