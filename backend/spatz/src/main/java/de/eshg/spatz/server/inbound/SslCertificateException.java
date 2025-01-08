/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server.inbound;

import java.io.Serial;

public class SslCertificateException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public SslCertificateException(String message, Throwable cause) {
    super(message, cause);
  }

  public SslCertificateException(String message) {
    super(message);
  }
}
