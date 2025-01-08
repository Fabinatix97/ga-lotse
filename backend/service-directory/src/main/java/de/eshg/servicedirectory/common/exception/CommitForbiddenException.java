/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.common.exception;

import java.io.Serial;

public class CommitForbiddenException extends RuntimeException {
  @Serial private static final long serialVersionUID = 0;

  public CommitForbiddenException(String message) {
    super(message);
  }
}
