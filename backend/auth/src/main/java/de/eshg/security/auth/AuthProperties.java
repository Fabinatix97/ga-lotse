/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "eshg")
@Validated
public record AuthProperties(
    @NotNull @Valid Auth auth,
    @NotNull @Valid HavingUrl reverseProxy,
    @NotNull @Valid Keycloak keycloak) {
  private static final Logger log = LoggerFactory.getLogger(AuthProperties.class);

  public AuthProperties {
    if (auth.accessCodeUrlPatterns() != null) {
      log.info("Access code URL patterns: {}", auth.accessCodeUrlPatterns());
    }
    if (auth.mukUrlPatterns() != null) {
      log.info("MUK URL patterns: {}", auth.mukUrlPatterns());
    }
  }

  public List<String> getAccessCodeUrlPatterns() {
    if (auth() == null) {
      return null;
    }
    return auth().accessCodeUrlPatterns();
  }

  public List<String> getMukUrlPatterns() {
    if (auth() == null) {
      return null;
    }
    return auth().mukUrlPatterns();
  }

  public List<String> getLanguagePathPrefixes() {
    if (auth() == null) {
      return null;
    }
    return auth().languagePathPrefixes();
  }

  record Auth(
      List<String> languagePathPrefixes,
      List<String> accessCodeUrlPatterns,
      List<String> mukUrlPatterns,
      @Valid UserAgentFilter userAgentFilter) {}

  record Keycloak(@NotNull HavingUrl logout) {}

  record HavingUrl(@NotNull URI url) {}

  record UserAgentFilter(boolean enabled, @NotEmpty Map<String, UserAgentMinimumVersion> allowed) {}

  record UserAgentMinimumVersion(Pattern userAgentPattern, String minimumVersion) {}
}
