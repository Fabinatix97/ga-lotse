/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring;

import de.eshg.lib.keycloak.*;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.api.RealmDto;
import de.eshg.testhelper.api.TestHelperLoginRequest;
import java.util.Locale;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.util.MultiValueMap;

public interface AuthenticationTraits {

  String PERMISSION_ROLE_PASSWORD = "password";

  default AccessToken login() {
    return login(EmployeeTestUser.DUMMY);
  }

  default AccessToken login(KeycloakUser user) {
    return switch (user) {
      case EmployeeTestUser e -> login(e.getUsernamePassword());
      case CitizenTestUser c -> login(c.getUsernamePassword());
      default -> throw new IllegalStateException("Unexpected value: " + user);
    };
  }

  default AccessToken login(UsernamePassword usernamePassword) {
    return login(
        new TestHelperLoginRequest(
            usernamePassword.username(),
            usernamePassword.password(),
            mapRealm(usernamePassword.realm())));
  }

  default AccessToken login(PermissionRole role) {
    Realm realm =
        switch (role) {
          case EmployeePermissionRole ignored -> Realm.EMPLOYEES;
          case CitizenPermissionRole ignored -> Realm.CITIZENS;
        };
    return login(
        new UsernamePassword(
            role.name().toLowerCase(Locale.ROOT), PERMISSION_ROLE_PASSWORD, realm));
  }

  default AccessToken login(TestHelperLoginRequest loginRequest) {
    throw new UnsupportedOperationException("Authentication support is not (yet) implemented");
  }

  private static RealmDto mapRealm(Realm realm) {
    return switch (realm) {
      case EMPLOYEES -> RealmDto.EMPLOYEES;
      case CITIZENS -> RealmDto.CITIZENS;
    };
  }

  default HttpEntity<Void> authenticatedRequest() {
    return authenticatedRequest(null, null);
  }

  default HttpEntity<Void> authenticatedRequest(AccessToken accessToken) {
    return authenticatedRequest(accessToken, null);
  }

  default <T> HttpEntity<T> authenticatedRequest(AccessToken accessToken, T body) {
    return authenticatedRequest(accessToken, body, null);
  }

  default <T> HttpEntity<T> authenticatedRequest(
      AccessToken accessToken, T body, MultiValueMap<String, String> customHeaders) {
    if (accessToken == null) {
      return authenticatedRequest(login(), body, customHeaders);
    }
    HttpHeaders headers = newHttpHeaders(accessToken, customHeaders);
    return new HttpEntity<>(body, headers);
  }

  default <T> HttpEntity<T> authenticatedRequest(T requestBody) {
    return authenticatedRequest(null, requestBody);
  }

  private static HttpHeaders newHttpHeaders(
      AccessToken accessToken, MultiValueMap<String, String> customHeaders) {
    HttpHeaders headers = new HttpHeaders();
    if (accessToken.jwt() != null) {
      headers.setBearerAuth(accessToken.jwt());
    }

    if (customHeaders != null) {
      headers.addAll(customHeaders);
    }
    return headers;
  }
}
