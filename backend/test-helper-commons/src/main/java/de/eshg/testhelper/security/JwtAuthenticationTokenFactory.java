/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.security;

import static java.util.Collections.emptyList;

import com.nimbusds.jwt.JWTParser;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.testhelper.AccessToken;
import java.text.ParseException;
import org.springframework.security.oauth2.jwt.JoseHeaderNames;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class JwtAuthenticationTokenFactory {

  private JwtAuthenticationTokenFactory() {}

  public static JwtAuthenticationToken fromAccessToken(AccessToken accessToken) {
    Jwt jwt =
        Jwt.withTokenValue(accessToken.jwt())
            .header(JoseHeaderNames.TYP, "Bearer")
            .claim(KeycloakRole.CLAIM_NAME, "")
            .build();

    return new JwtAuthenticationToken(jwt, emptyList(), parseSubject(accessToken));
  }

  private static String parseSubject(AccessToken accessToken) {
    try {
      return JWTParser.parse(accessToken.jwt()).getJWTClaimsSet().getSubject();
    } catch (ParseException e) {
      throw new IllegalArgumentException(e);
    }
  }
}
