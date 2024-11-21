/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.SharedAuditLogTestHelperApi.BASE_URL;

import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(BASE_URL)
public interface AuditLogTestHelperApi extends SharedAuditLogTestHelperApi {

  String BASE_URL = "/test-helper";
}
