/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.AuditLogClientTestHelperApi.BASE_URL;

import java.io.IOException;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(BASE_URL)
public interface AuditLogServiceTestHelperApi {

  String BASE_URL = "/test-helper";

  @DeleteExchange("audit-log-storage")
  void clearAuditLogStorageDirectory() throws IOException;
}
