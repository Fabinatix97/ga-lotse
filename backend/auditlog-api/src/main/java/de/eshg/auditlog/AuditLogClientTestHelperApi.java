/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.AuditLogClientTestHelperApi.BASE_URL;

import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(BASE_URL)
public interface AuditLogClientTestHelperApi {

  String BASE_URL = "/test-helper";

  @PostExchange("archiving-job")
  void runAuditLogArchivingJob();
}
