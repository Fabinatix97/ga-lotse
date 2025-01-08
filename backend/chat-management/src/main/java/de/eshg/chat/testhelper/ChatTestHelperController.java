/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.testhelper;

import de.eshg.chat.featuretoggle.ChatFeature;
import de.eshg.chat.featuretoggle.ChatFeatureToggle;
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
public class ChatTestHelperController extends TestHelperController {

  private final ChatFeatureToggle chatFeatureToggle;

  public ChatTestHelperController(
      DefaultTestHelperService defaultTestHelperService,
      ChatFeatureToggle chatFeatureToggle,
      EnvironmentConfig environmentConfig) {
    super(defaultTestHelperService, environmentConfig);
    this.chatFeatureToggle = chatFeatureToggle;
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(@PathVariable("featureToEnable") ChatFeature featureToEnable) {
    chatFeatureToggle.enableNewFeature(featureToEnable);
  }

  @DeleteExchange("/enabled-new-features/{featureToDisable}")
  public void disableNewFeature(@PathVariable("featureToDisable") ChatFeature featureToDisable) {
    chatFeatureToggle.disableNewFeature(featureToDisable);
  }
}
