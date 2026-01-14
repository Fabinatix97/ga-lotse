/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.exception;

import java.io.Serial;

public class SignatureServiceException extends IllegalStateException {
  @Serial private static final long serialVersionUID = 1L;

  public SignatureServiceException(String message, Throwable cause) {
    super(message, cause);
  }
}
