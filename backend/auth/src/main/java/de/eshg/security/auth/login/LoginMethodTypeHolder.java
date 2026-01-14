/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import java.io.Serial;
import java.io.Serializable;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

@Component
@SessionScope
public class LoginMethodTypeHolder implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  private LoginMethodType loginMethodType;

  public LoginMethodType getLoginMethodType() {
    return loginMethodType;
  }

  public void setLoginMethodType(LoginMethodType loginMethodType) {
    this.loginMethodType = loginMethodType;
  }
}
