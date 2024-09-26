/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.SharedAuditLogTestHelperApi.BASE_URL;

import de.eshg.auditlog.feature.AuditLogFeature;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(BASE_URL)
public interface AuditLogTestHelperApi extends SharedAuditLogTestHelperApi {

  String BASE_URL = "/test-helper";

  @PostExchange("/enabled-new-features/{featureToEnable}")
  void enableNewFeature(@PathVariable("featureToEnable") AuditLogFeature featureToEnable);
}
