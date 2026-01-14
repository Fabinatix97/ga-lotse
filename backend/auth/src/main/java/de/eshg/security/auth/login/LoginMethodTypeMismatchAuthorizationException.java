/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import java.io.Serial;
import org.springframework.security.core.AuthenticationException;

public class LoginMethodTypeMismatchAuthorizationException extends AuthenticationException {
  @Serial private static final long serialVersionUID = 1L;

  public LoginMethodTypeMismatchAuthorizationException() {
    super("Active login method type does not match requested provider");
  }
}
