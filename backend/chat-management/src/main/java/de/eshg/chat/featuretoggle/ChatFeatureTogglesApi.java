/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.featuretoggle;

import de.eshg.rest.service.security.config.BaseUrls;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(value = ChatFeatureTogglesApi.BASE_URL)
public interface ChatFeatureTogglesApi {
  String BASE_URL = BaseUrls.ChatManagement.FEATURE_TOGGLES_CONTROLLER;

  @GetExchange
  GetFeatureTogglesResponse getFeatureToggles();
}
