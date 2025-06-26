/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.rest.service.security.config.AbstractPublicSecurityConfiguration;
import de.eshg.rest.service.security.config.AnyRole;
import de.eshg.rest.service.security.config.Authenticated;
import de.eshg.rest.service.security.config.AuthorizationDefinition;
import de.eshg.rest.service.security.config.DenyAll;
import de.eshg.rest.service.security.config.PermitAll;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping(AuthController.BASE_URL)
@Hidden
public class AuthController {

  static final String BASE_URL = "/";

  private static final Logger log = LoggerFactory.getLogger(AuthController.class);

  public static final String X_ORIGINAL_URI_HEADER = "X-Original-URI";
  public static final String X_ORIGINAL_METHOD_HEADER = "X-Original-Method";

  public AuthController(List<AbstractPublicSecurityConfiguration> securityConfigurations) {
    this.securityConfigurations = securityConfigurations;
  }

  private final List<AbstractPublicSecurityConfiguration> securityConfigurations;

  /*
   * This endpoint is designed to be used in Nginx’s "auth_request" to decide whether access to a specific URL is allowed.
   */
  @GetMapping
  ResponseEntity<Void> checkAccess(
      @RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient client,
      // Actually we would like to use java.net.URI here but this leads to an
      // exception for URLs with square brackets that are used by Next.js 14
      @RequestHeader(X_ORIGINAL_URI_HEADER) String originalUri,
      @RequestHeader(X_ORIGINAL_METHOD_HEADER) HttpMethod originalMethod,
      @RequestHeader(value = SecFetchHeaderUtil.SEC_FETCH_SITE_HEADER_NAME, required = false)
          String secFetchSite) {
    validateUri(originalUri);
    validateHttpMethod(originalMethod);
    OAuth2AccessToken accessToken = client.getAccessToken();
    String originalUriPath =
        Objects.requireNonNull(UriComponentsBuilder.fromUriString(originalUri).build().getPath());
    if (originalUriPath.startsWith(AbstractPublicSecurityConfiguration.BACKEND_BASE_PATH + "/")) {
      SecFetchHeaderUtil.verifySecFetchSiteHeader(secFetchSite, SecFetchSite.SAME_ORIGIN);

      AuthorizationDefinition authorizationDefinition =
          findAuthorizationDefinition(originalUriPath, originalMethod);

      switch (authorizationDefinition) {
        case AnyRole anyRole -> {
          List<String> keycloakRoleNames = RolesResolver.getRoles(accessToken);

          if (!anyRole.intersects(keycloakRoleNames)) {
            throw new ForbiddenException("Found none of the granted roles");
          }
        }
        case DenyAll denyAll -> {
          throw new ForbiddenException("Access not allowed");
        }
        case Authenticated ignored -> {
          log.trace("No additional checks necessary. User is authenticated");
        }
        case PermitAll ignored -> {
          log.trace("No additional checks necessary. User is authenticated");
        }
      }

      log.info(
          "Permission granted to {} {} for {}",
          originalMethod,
          originalUri,
          authorizationDefinition);
    } else {
      log.info("Permission granted for non-backend URL {}", originalUri);
    }

    return ResponseEntity.ok()
        .header(
            HttpHeaders.AUTHORIZATION,
            accessToken.getTokenType().getValue() + " " + accessToken.getTokenValue())
        .build();
  }

  private AuthorizationDefinition findAuthorizationDefinition(
      String originalUri, HttpMethod originalMethod) {
    return securityConfigurations.stream()
        .map(
            securityConfiguration ->
                securityConfiguration.findAuthorizationDefinitionByMethodAndUrl(
                    originalMethod, originalUri))
        .filter(Objects::nonNull)
        .collect(
            StreamUtil.toSingleElement(
                securityConfigurations -> {
                  if (securityConfigurations.isEmpty()) {
                    return new ForbiddenException(
                        "Found no security configuration for %s %s"
                            .formatted(originalMethod, originalUri));
                  }
                  return new IllegalStateException(
                      "Found multiple security configurations for %s %s: %s"
                          .formatted(originalMethod, originalUri, securityConfigurations));
                }));
  }

  private static void validateUri(String uri) {
    if (!uri.startsWith("/") || uri.contains(" ")) {
      throw new BadRequestException("Illegal URI: '%s'".formatted(uri));
    }
  }

  private static void validateHttpMethod(HttpMethod httpMethod) {
    if (Arrays.stream(HttpMethod.values()).noneMatch(httpMethod::equals)) {
      throw new BadRequestException("Unknown HTTP method: '%s'".formatted(httpMethod));
    }
  }
}
