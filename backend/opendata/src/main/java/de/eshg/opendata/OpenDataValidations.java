/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.opendata.config.OpenDataFeature;
import de.eshg.opendata.config.OpenDataFeatureToggle;
import de.eshg.rest.service.error.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class OpenDataValidations {

  private final OpenDataFeatureToggle openDataFeatureToggle;

  public OpenDataValidations(OpenDataFeatureToggle openDataFeatureToggle) {
    this.openDataFeatureToggle = openDataFeatureToggle;
  }

  void validateOpenDataEnabled() {
    if (!openDataFeatureToggle.isNewFeatureEnabled(OpenDataFeature.OPEN_DATA)) {
      throw new BadRequestException(
          "New feature %s is not enabled".formatted(OpenDataFeature.OPEN_DATA));
    }
  }
}
