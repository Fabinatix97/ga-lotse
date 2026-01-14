/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import de.eshg.lib.keycloak.KeycloakRole;
import java.text.ParseException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.core.OAuth2AccessToken;

public class RolesResolver {

  private RolesResolver() {}

  private static final Logger log = LoggerFactory.getLogger(RolesResolver.class);

  public static List<String> getRoles(OAuth2AccessToken accessToken) {
    try {
      JWT jwt = JWTParser.parse(accessToken.getTokenValue());
      List<String> roles =
          jwt.getJWTClaimsSet().getStringListClaim(KeycloakRole.CLAIM_NAME).stream()
              .sorted()
              .toList();
      log.debug("Roles: {}", roles);
      return roles;
    } catch (ParseException e) {
      throw new UnauthorizedException("Failed to parse the JWT token", e);
    }
  }
}
