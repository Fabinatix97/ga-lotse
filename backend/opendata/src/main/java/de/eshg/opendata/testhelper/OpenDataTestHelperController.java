/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.testhelper;

import de.eshg.opendata.config.OpenDataFeature;
import de.eshg.opendata.config.OpenDataFeatureToggle;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class OpenDataTestHelperController extends TestHelperController {

  private final OpenDataFeatureToggle openDataFeatureToggle;

  public OpenDataTestHelperController(
      DefaultTestHelperService testHelperService,
      OpenDataFeatureToggle openDataFeatureToggle,
      EnvironmentConfig environmentConfig) {
    super(testHelperService, environmentConfig);
    this.openDataFeatureToggle = openDataFeatureToggle;
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(@PathVariable("featureToEnable") OpenDataFeature featureToEnable) {
    openDataFeatureToggle.enableNewFeature(featureToEnable);
  }

  @DeleteExchange("/enabled-new-features/{featureToDisable}")
  public void disableNewFeature(
      @PathVariable("featureToDisable") OpenDataFeature featureToDisable) {
    openDataFeatureToggle.disableNewFeature(featureToDisable);
  }
}
