/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.rest.service.error.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class OpenDataValidations {

  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public OpenDataValidations(BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  void validateOpenDataEnabled() {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.OPEN_DATA)) {
      throw new BadRequestException(
          "New feature %s is not enabled".formatted(BaseFeature.OPEN_DATA));
    }
  }
}
