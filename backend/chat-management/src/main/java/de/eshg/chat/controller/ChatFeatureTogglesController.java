/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.controller;

import de.eshg.chat.featuretoggle.ChatFeatureToggle;
import de.eshg.chat.featuretoggle.ChatFeatureTogglesApi;
import de.eshg.chat.featuretoggle.GetFeatureTogglesResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "ChatFeatureToggles")
public class ChatFeatureTogglesController implements ChatFeatureTogglesApi {
  private final ChatFeatureToggle baseFeatureToggle;

  public ChatFeatureTogglesController(ChatFeatureToggle baseFeatureToggle) {
    this.baseFeatureToggle = baseFeatureToggle;
  }

  @Override
  public GetFeatureTogglesResponse getFeatureToggles() {
    return new GetFeatureTogglesResponse(
        baseFeatureToggle.getEnabledNewFeatures(), baseFeatureToggle.getDisabledOldFeatures());
  }
}
