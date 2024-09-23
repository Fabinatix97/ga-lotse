/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import de.cronn.commons.lang.StreamUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.security.web.savedrequest.SimpleSavedRequest;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

class ReverseProxyAwareHttpSessionRequestCache extends HttpSessionRequestCache {

  private static final Logger log =
      LoggerFactory.getLogger(ReverseProxyAwareHttpSessionRequestCache.class);

  /**
   * regex for service-worker files, either "/sw.js" or "/worker-[hash].js" or "/workbox-[hash].js"
   */
  private static final Pattern SERVICE_WORKER_REGEX =
      Pattern.compile("^/(sw|(worker-|workbox-)\\p{Alnum}+)\\.js$");

  @Override
  public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
    super.saveRequest(request, response);
  }

  @Override
  public SavedRequest getRequest(HttpServletRequest currentRequest, HttpServletResponse response) {
    SavedRequest request = super.getRequest(currentRequest, response);
    if (request == null) {
      return request;
    }

    String redirectUri =
        getSingleOptionalHeader(request, AuthController.X_ORIGINAL_URI_HEADER).orElse(null);

    if (redirectUri != null) {
      HttpMethod originalMethod =
          getSingleOptionalHeader(request, AuthController.X_ORIGINAL_METHOD_HEADER)
              .map(HttpMethod::valueOf)
              .orElse(null);

      // This is a paranoia check and it must not happen.
      // Redirecting the browser as response of a POST/PUT request makes no sense.
      if (Objects.equals(originalMethod, HttpMethod.GET)) {
        UriComponentsBuilder newRedirectUriBuilder =
            buildNewRedirectUri(request.getRedirectUrl(), redirectUri);

        String newRedirectUri = newRedirectUriBuilder.build().toUriString();
        log.debug("Redirecting to original URI: '{}'", newRedirectUri);
        return new SimpleSavedRequest(newRedirectUri);
      } else {
        log.warn(
            "Not redirecting to '{}' since original method was {}", redirectUri, originalMethod);
      }
    }

    return request;
  }

  protected UriComponentsBuilder buildNewRedirectUri(
      String previousRedirectUrl, String newRedirectUri) {
    UriComponents previousRedirectUriComponents =
        UriComponentsBuilder.fromUriString(previousRedirectUrl).build();
    UriComponentsBuilder newUriBuilder =
        UriComponentsBuilder.fromUriString(newRedirectUri)
            .scheme(previousRedirectUriComponents.getScheme())
            .host(previousRedirectUriComponents.getHost())
            .port(previousRedirectUriComponents.getPort());
    String path = newUriBuilder.build().getPath();
    if (path != null && SERVICE_WORKER_REGEX.matcher(path).matches()) {
      // ISSUE-5093: alas, there is no other way to prevent the browser from
      // redirecting to /sw.js or other service-worker files during login
      log.info("Replacing {} with /", path);
      newUriBuilder.replacePath("/");
    }
    return newUriBuilder;
  }

  private static Optional<String> getSingleOptionalHeader(SavedRequest request, String headerName) {
    return request.getHeaderValues(headerName).stream()
        .collect(StreamUtil.toSingleOptionalElement());
  }
}
