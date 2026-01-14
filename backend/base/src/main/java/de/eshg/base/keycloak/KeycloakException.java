/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import java.io.Serial;

public class KeycloakException extends RuntimeException {
  @Serial private static final long serialVersionUID = 0;

  public KeycloakException(String message, Throwable cause) {
    super(message, cause);
  }

  public KeycloakException(String message) {
    super(message);
  }
}
