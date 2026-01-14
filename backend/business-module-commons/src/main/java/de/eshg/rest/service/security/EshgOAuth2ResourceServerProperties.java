/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(value = "eshg.security.oauth2.resourceserver", ignoreUnknownFields = false)
public class EshgOAuth2ResourceServerProperties {

  @Valid private final EshgJwt employeeJwt = new EshgJwt();

  @Valid private final EshgJwt citizenJwt = new EshgJwt();

  public EshgJwt getEmployeeJwt() {
    return employeeJwt;
  }

  public EshgJwt getCitizenJwt() {
    return citizenJwt;
  }

  public static class EshgJwt {

    /** JSON Web Key URI to use to verify the JWT token. */
    @NotEmpty private String jwkSetUri;

    /** JSON Web Algorithms used for verifying the digital signatures. */
    private List<String> jwsAlgorithms =
        new OAuth2ResourceServerProperties.Jwt().getJwsAlgorithms();

    /**
     * URI that can either be an OpenID Connect discovery endpoint or an OAuth 2.0 Authorization
     * Server Metadata endpoint defined by RFC 8414.
     */
    @NotEmpty private String issuerUri;

    public String getJwkSetUri() {
      return jwkSetUri;
    }

    public void setJwkSetUri(String jwkSetUri) {
      this.jwkSetUri = jwkSetUri;
    }

    public List<String> getJwsAlgorithms() {
      return jwsAlgorithms;
    }

    public void setJwsAlgorithms(List<String> jwsAlgorithms) {
      this.jwsAlgorithms = jwsAlgorithms;
    }

    public String getIssuerUri() {
      return issuerUri;
    }

    public void setIssuerUri(String issuerUri) {
      this.issuerUri = issuerUri;
    }
  }
}
