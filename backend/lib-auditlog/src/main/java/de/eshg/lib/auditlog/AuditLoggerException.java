/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import java.io.Serial;

public class AuditLoggerException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  AuditLoggerException(String message, Throwable cause) {
    super(message, cause);
  }
}
