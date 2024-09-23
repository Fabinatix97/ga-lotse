/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.test.security;

import de.eshg.lib.keycloak.EmployeeTestUser;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.LoginProvider;
import de.eshg.testhelper.api.RealmDto;
import de.eshg.testhelper.api.TestHelperLoginRequest;
import de.eshg.testhelper.security.JwtAuthenticationTokenFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

public final class JwtEmployeeAuthenticationSecurityContextFactory
    implements WithSecurityContextFactory<WithEmployeeTestUserAuthentication> {

  private final LoginProvider loginProvider;

  public JwtEmployeeAuthenticationSecurityContextFactory(LoginProvider loginProvider) {
    this.loginProvider = loginProvider;
  }

  @Override
  public SecurityContext createSecurityContext(WithEmployeeTestUserAuthentication annotation) {
    EmployeeTestUser testUser = annotation.testUser();
    AccessToken accessToken =
        loginProvider.login(
            new TestHelperLoginRequest(
                testUser.username(), testUser.password(), RealmDto.EMPLOYEES));

    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(JwtAuthenticationTokenFactory.fromAccessToken(accessToken));
    return context;
  }
}
