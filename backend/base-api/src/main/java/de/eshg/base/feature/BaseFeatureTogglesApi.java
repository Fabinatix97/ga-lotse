/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.feature;

import de.eshg.rest.service.security.config.BaseUrls;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(value = BaseFeatureTogglesApi.BASE_URL)
public interface BaseFeatureTogglesApi {
  String BASE_URL = BaseUrls.Base.FEATURE_TOGGLES_API;

  @GetExchange
  GetBaseFeatureTogglesResponse getFeatureToggles();
}
