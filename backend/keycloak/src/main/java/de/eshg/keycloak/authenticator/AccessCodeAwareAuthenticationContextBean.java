/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import org.keycloak.forms.login.freemarker.model.AuthenticationContextBean;

public class AccessCodeAwareAuthenticationContextBean extends AuthenticationContextBean {

  public AccessCodeAwareAuthenticationContextBean() {
    super(null, null);
  }

  @Override
  public boolean showTryAnotherWayLink() {
    return false;
  }

  @Override
  public boolean showUsername() {
    return false;
  }

  @Override
  public boolean showResetCredentials() {
    return false;
  }
}
