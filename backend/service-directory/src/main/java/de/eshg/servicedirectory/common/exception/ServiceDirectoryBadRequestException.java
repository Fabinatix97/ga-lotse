/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.common.exception;

import java.io.Serial;

public class ServiceDirectoryBadRequestException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public ServiceDirectoryBadRequestException(String message) {
    super(message);
  }

  public ServiceDirectoryBadRequestException(String message, Throwable cause) {
    super(message, cause);
  }
}
