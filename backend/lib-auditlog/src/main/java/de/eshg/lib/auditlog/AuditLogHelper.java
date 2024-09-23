/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

final class AuditLogHelper {

  private AuditLogHelper() {}

  static String getAuditLogFileName(LocalDate localDate) {
    return localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
  }
}
