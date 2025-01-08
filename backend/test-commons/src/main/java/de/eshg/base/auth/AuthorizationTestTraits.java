/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.auth;

import de.cronn.assertions.validationfile.FileExtensions;
import de.cronn.assertions.validationfile.junit5.JUnit5ValidationFileAssertions;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.cronn.assertions.validationfile.replacements.Replacer;
import de.eshg.AuthorizationTest;
import de.eshg.base.auth.AuthorizationTestUtil.PermissionRoleAndAccessToken;
import de.eshg.base.spring.AuthenticationTraits;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import java.util.List;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@AuthorizationTest
public interface AuthorizationTestTraits
    extends JUnit5ValidationFileAssertions, AuthenticationTraits {

  default void testEndpointAuthorization(
      TestRestTemplate testRestTemplate, RequestMappingHandlerMapping requestMapping) {
    testEndpointAuthorization(testRestTemplate, requestMapping, null);
  }

  default void testEndpointAuthorization(
      TestRestTemplate testRestTemplate,
      RequestMappingHandlerMapping requestMapping,
      ValidationNormalizer validationNormalizer) {
    List<PermissionRoleAndAccessToken> roleAndAccessTokens =
        AuthorizationTestUtil.getAccessTokensForAllPermissionRoles(this::login);

    assertWithFile(
        AuthorizationTestUtil.getEndpointAuthorizationMatrixAsMarkdown(
            testRestTemplate, requestMapping, roleAndAccessTokens),
        validationNormalizer,
        FileExtensions.MD);
  }

  default ValidationNormalizer configuredPermissionRoleNormalizer(
      EmployeePermissionRole configuredPermissionRole) {
    return new Replacer(configuredPermissionRole.name(), "CONFIGURED_PERMISSION_ROLE");
  }
}
