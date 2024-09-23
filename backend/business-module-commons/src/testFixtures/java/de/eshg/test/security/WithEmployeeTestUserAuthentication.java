/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.test.security;

import de.eshg.lib.keycloak.EmployeeTestUser;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.springframework.security.test.context.support.WithSecurityContext;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = JwtEmployeeAuthenticationSecurityContextFactory.class)
public @interface WithEmployeeTestUserAuthentication {
  EmployeeTestUser testUser() default EmployeeTestUser.DUMMY;
}
