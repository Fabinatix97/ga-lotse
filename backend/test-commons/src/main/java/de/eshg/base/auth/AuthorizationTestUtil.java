/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.auth;

import de.cronn.assertions.validationfile.util.MarkdownTable;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.PermissionRole;
import de.eshg.testhelper.AccessToken;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.util.StreamUtils;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.condition.PathPatternsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

public final class AuthorizationTestUtil {

  private AuthorizationTestUtil() {}

  private static final String DEFAULT_PATH_PARAM_VALUE = "1";

  private static final List<String> DEFAULT_IGNORED_PATH_PREFIXES =
      List.of("/api-docs", "/test-helper", "/simulator");

  /**
   * See {@link
   * org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport#requestMappingHandlerMapping}
   */
  public static final String REQUEST_MAPPING_HANDLER_MAPPING_BEAN_NAME =
      "requestMappingHandlerMapping";

  static List<PermissionRoleAndAccessToken> getAccessTokensForAllPermissionRoles(
      Function<PermissionRole, AccessToken> loginFunction) {
    return getAccessTokensForPermissionRoles(getAllPermissionRoles(), loginFunction);
  }

  static List<PermissionRoleAndAccessToken> getAccessTokensForPermissionRoles(
      Stream<PermissionRole> permissionRoles, Function<PermissionRole, AccessToken> loginFunction) {
    return permissionRoles.map(r -> getPermissionRoleAndAccessToken(r, loginFunction)).toList();
  }

  private static Stream<PermissionRole> getAllPermissionRoles() {
    return Stream.concat(
        Stream.of(EmployeePermissionRole.values()), Stream.of(CitizenPermissionRole.values()));
  }

  private static PermissionRoleAndAccessToken getPermissionRoleAndAccessToken(
      PermissionRole role, Function<PermissionRole, AccessToken> loginFunction) {
    AccessToken accessToken = loginFunction.apply(role);
    return new PermissionRoleAndAccessToken(role, accessToken.jwt());
  }

  static String getEndpointAuthorizationMatrixAsMarkdown(
      TestRestTemplate testRestTemplate,
      RequestMappingHandlerMapping requestMapping,
      List<PermissionRoleAndAccessToken> permissionRolesAndAccessTokens) {
    List<Endpoint> endpoints = getAllEndpoints(requestMapping);
    List<EndpointAuthAssertion> assertions =
        getAllEndpointAuthAssertions(endpoints, permissionRolesAndAccessTokens);
    List<EndpointAuthAssertionResult> assertionResults =
        getAuthAssertionResults(testRestTemplate, assertions);
    return parseValidationTable(
            assertionResults, getAllPermissionRoles(permissionRolesAndAccessTokens))
        .toString();
  }

  private static Set<PermissionRole> getAllPermissionRoles(
      List<PermissionRoleAndAccessToken> permissionRolesAndAccessTokens) {
    return permissionRolesAndAccessTokens.stream()
        .map(PermissionRoleAndAccessToken::role)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static List<Endpoint> getAllEndpoints(RequestMappingHandlerMapping requestMapping) {
    List<Endpoint> endpoints = new ArrayList<>();

    for (RequestMappingInfo info : requestMapping.getHandlerMethods().keySet()) {
      PathPatternsRequestCondition pathPatternsCondition = info.getPathPatternsCondition();
      if (pathPatternsCondition == null) {
        throw new IllegalStateException("Request Mapping missing path pattern conditions");
      }
      endpoints.addAll(
          mapToEndpoints(
              pathPatternsCondition.getPatternValues(), info.getMethodsCondition().getMethods()));
    }
    endpoints.sort(
        (s1, s2) ->
            Comparator.comparing(Endpoint::path).thenComparing(Endpoint::method).compare(s1, s2));
    return endpoints;
  }

  private static List<Endpoint> mapToEndpoints(Set<String> paths, Set<RequestMethod> methods) {
    return StreamUtils.zip(
            paths.stream(),
            methods.stream(),
            (path, method) -> new Endpoint(method.asHttpMethod(), replaceIdPlaceholder(path)))
        .filter(
            endpoint ->
                DEFAULT_IGNORED_PATH_PREFIXES.stream().noneMatch(endpoint.path()::startsWith))
        .toList();
  }

  private static String replaceIdPlaceholder(String path) {
    return path.replaceAll("\\{[a-zA-Z]*}", DEFAULT_PATH_PARAM_VALUE);
  }

  private static List<EndpointAuthAssertion> getAllEndpointAuthAssertions(
      List<Endpoint> endpoints, List<PermissionRoleAndAccessToken> permissionRolesAndAccessTokens) {
    return endpoints.stream()
        .map(endpoint -> new EndpointAuthAssertion(endpoint, permissionRolesAndAccessTokens))
        .toList();
  }

  private static List<EndpointAuthAssertionResult> getAuthAssertionResults(
      TestRestTemplate testRestTemplate, List<EndpointAuthAssertion> assertions) {
    return assertions.stream()
        .map(
            assertion ->
                new EndpointAuthAssertionResult(
                    assertion.endpoint(),
                    testForAllowedRoles(testRestTemplate, assertion, assertion.endpoint())))
        .toList();
  }

  private static List<PermissionRole> testForAllowedRoles(
      TestRestTemplate testRestTemplate, EndpointAuthAssertion assertion, Endpoint endpoint) {
    List<PermissionRole> allowedRoles = new ArrayList<>();
    for (PermissionRoleAndAccessToken permissionRoleAndAccessToken :
        assertion.permissionRoleAndAccessToken()) {
      HttpStatusCode status =
          testEndpointAccess(testRestTemplate, endpoint, permissionRoleAndAccessToken);
      if (isAllowed(status)) {
        allowedRoles.add(permissionRoleAndAccessToken.role());
      }
    }
    return allowedRoles;
  }

  private static HttpStatusCode testEndpointAccess(
      TestRestTemplate testRestTemplate,
      Endpoint endpoint,
      PermissionRoleAndAccessToken permissionRoleAndAccessToken) {
    return testRestTemplate
        .exchange(
            endpoint.path(),
            endpoint.method(),
            new HttpEntity<>(authorizationHeader(permissionRoleAndAccessToken.accessToken())),
            byte[].class)
        .getStatusCode();
  }

  private static HttpHeaders authorizationHeader(String accessToken) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(accessToken);
    return headers;
  }

  private static boolean isAllowed(HttpStatusCode status) {
    HttpStatus resolved = HttpStatus.valueOf(status.value());
    return switch (resolved) {
      case FORBIDDEN, METHOD_NOT_ALLOWED -> false;
      case BAD_REQUEST, UNSUPPORTED_MEDIA_TYPE, NOT_FOUND, INTERNAL_SERVER_ERROR -> true;
      default -> {
        if (!resolved.is2xxSuccessful()) {
          throw new IllegalArgumentException("Unexpected status code: " + resolved.value());
        }
        yield true;
      }
    };
  }

  private static MarkdownTable parseValidationTable(
      List<EndpointAuthAssertionResult> assertionResults, Set<PermissionRole> allPermissionRoles) {
    MarkdownTable table = new MarkdownTable(List.of("METHOD", "URL", "ALLOWED_ROLES"));
    assertionResults.forEach(
        result ->
            table.addRow(
                result.endpoint().method().name(),
                result.endpoint().path(),
                getAllowedRoles(result, allPermissionRoles)));
    return table;
  }

  private static String getAllowedRoles(
      EndpointAuthAssertionResult result, Set<PermissionRole> allPermissionRoles) {
    Set<PermissionRole> allowedRoles = new LinkedHashSet<>(result.allowedRoles());

    if (allowedRoles.equals(allPermissionRoles)) {
      return "ANY";
    }

    Set<CitizenPermissionRole> allCitizenPermissionRoles =
        allPermissionRoles.stream()
            .filter(CitizenPermissionRole.class::isInstance)
            .map(CitizenPermissionRole.class::cast)
            .collect(StreamUtil.toLinkedHashSet());

    if (allowedRoles.equals(allCitizenPermissionRoles)) {
      return "ANY_CITIZEN";
    }

    Set<EmployeePermissionRole> allEmployeePermissionRoles =
        allPermissionRoles.stream()
            .filter(EmployeePermissionRole.class::isInstance)
            .map(EmployeePermissionRole.class::cast)
            .collect(StreamUtil.toLinkedHashSet());

    if (allowedRoles.equals(allEmployeePermissionRoles)) {
      return "ANY_EMPLOYEE";
    }

    return allowedRoles.stream().map(PermissionRole::name).collect(Collectors.joining("<br>"));
  }

  public record PermissionRoleAndAccessToken(PermissionRole role, String accessToken) {}

  private record Endpoint(HttpMethod method, String path) {}

  private record EndpointAuthAssertion(
      Endpoint endpoint, List<PermissionRoleAndAccessToken> permissionRoleAndAccessToken) {}

  private record EndpointAuthAssertionResult(
      Endpoint endpoint, List<PermissionRole> allowedRoles) {}
}
