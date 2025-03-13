/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.exception;

import java.io.Serial;

public class InvalidCertificateException extends IllegalArgumentException {
  @Serial private static final long serialVersionUID = 1L;

  public InvalidCertificateException(String userIdFromCertificate, String userIdFromToken) {
    super(
        "user '"
            + userIdFromToken
            + "' tried to announce certificate for user '"
            + userIdFromCertificate
            + "'");
  }

  public InvalidCertificateException(String message) {
    super(message);
  }
}
