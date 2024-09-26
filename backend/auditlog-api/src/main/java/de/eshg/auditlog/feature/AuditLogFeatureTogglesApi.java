/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.feature;

import de.eshg.rest.service.security.config.BaseUrls.AuditLog;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(value = AuditLogFeatureTogglesApi.BASE_URL)
public interface AuditLogFeatureTogglesApi {
  String BASE_URL = AuditLog.FEATURE_TOGGLES_CONTROLLER;

  @GetExchange
  GetAuditLogFeatureTogglesResponse getFeatureToggles();
}
