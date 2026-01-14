/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.GetBaseFeatureTogglesResponse;
import de.eshg.rest.service.error.BadRequestException;

public class BaseFeatureTogglesHelper {
  public static void assertNewFeatureEnabled(
      BaseFeature feature, GetBaseFeatureTogglesResponse featureToggles) {
    if (!featureToggles.enabledNewFeatures().contains(feature)) {
      throw new BadRequestException("New feature %s is not enabled".formatted(feature));
    }
  }
}
