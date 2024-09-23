/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.AuditLogTestHelperApi.BASE_URL;

import java.io.IOException;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(BASE_URL)
public interface AuditLogTestHelperApi {

  String BASE_URL = "/test-helper";

  @DeleteExchange("audit-log-storage")
  void clearAuditLogStorageDirectory() throws IOException;

  @PostExchange("archiving-job")
  void runArchivingJob();
}
