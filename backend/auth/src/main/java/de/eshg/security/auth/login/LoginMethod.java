/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import de.eshg.security.auth.AuthProperties;
import java.util.List;
import java.util.Map;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.util.UriComponentsBuilder;

public abstract class LoginMethod {
  public static final String LOGIN_LOCALE_PARAM_NAME = "ui_locales";

  protected final AntPathMatcher antPathMatcher = new AntPathMatcher();
  protected final AuthProperties authProperties;

  protected LoginMethod(AuthProperties authProperties) {
    this.authProperties = authProperties;
  }

  protected abstract List<String> getPathPatterns();

  protected abstract void applyParameters(Map<String, Object> params, String redirectUrl);

  public OAuth2AuthorizationRequest apply(
      OAuth2AuthorizationRequest auth2AuthorizationRequest, String redirectUrl) {
    return OAuth2AuthorizationRequest.from(auth2AuthorizationRequest)
        .additionalParameters(params -> this.applyParameters(params, redirectUrl))
        .additionalParameters(
            params -> {
              String urlPath = UriComponentsBuilder.fromUriString(redirectUrl).build().getPath();
              LocaleAndPath localeAndPath = extractLanguagePathPrefix(urlPath);
              if (localeAndPath.language() != null) {
                params.put(LOGIN_LOCALE_PARAM_NAME, localeAndPath.language());
              }
            })
        .build();
  }

  public final boolean isApplicable(String url) {
    List<String> patterns = getPathPatterns();
    if (patterns == null) {
      return false;
    }
    String urlPath = UriComponentsBuilder.fromUriString(url).build().getPath();
    LocaleAndPath localeAndPath = extractLanguagePathPrefix(urlPath);
    String normalizedUrlPath = localeAndPath.path();
    return normalizedUrlPath != null
        && patterns.stream().anyMatch(pattern -> antPathMatcher.match(pattern, normalizedUrlPath));
  }

  private LocaleAndPath extractLanguagePathPrefix(String url) {
    List<String> languagePathPrefixes = authProperties.getLanguagePathPrefixes();
    if (languagePathPrefixes == null) {
      return new LocaleAndPath(null, url);
    }
    for (String languagePathPrefix : languagePathPrefixes) {
      if (url.startsWith(languagePathPrefix + "/")) {
        String locale = url.substring(1, languagePathPrefix.length());
        String subPath = url.substring(languagePathPrefix.length());
        return new LocaleAndPath(locale, subPath);
      }
    }
    return new LocaleAndPath(null, url);
  }

  record LocaleAndPath(String language, String path) {}
}
