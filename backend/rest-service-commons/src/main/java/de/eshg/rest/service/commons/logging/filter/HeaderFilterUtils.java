/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging.filter;

import java.util.Set;
import java.util.stream.Collectors;

class HeaderFilterUtils {

  private HeaderFilterUtils() {}

  public static final Set<String> WELL_KNOWN_HEADERS_THAT_CAN_BE_LOGGED =
      Set.of(
              org.springframework.http.HttpHeaders.ACCEPT,
              org.springframework.http.HttpHeaders.ACCEPT_CHARSET,
              org.springframework.http.HttpHeaders.ACCEPT_ENCODING,
              org.springframework.http.HttpHeaders.ACCEPT_LANGUAGE,
              org.springframework.http.HttpHeaders.ACCEPT_PATCH,
              org.springframework.http.HttpHeaders.ACCEPT_RANGES,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_MAX_AGE,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS,
              org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD,
              org.springframework.http.HttpHeaders.AGE,
              org.springframework.http.HttpHeaders.ALLOW,
              org.springframework.http.HttpHeaders.CACHE_CONTROL,
              org.springframework.http.HttpHeaders.CONNECTION,
              org.springframework.http.HttpHeaders.CONTENT_ENCODING,
              org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
              org.springframework.http.HttpHeaders.CONTENT_LANGUAGE,
              org.springframework.http.HttpHeaders.CONTENT_LENGTH,
              org.springframework.http.HttpHeaders.CONTENT_LOCATION,
              org.springframework.http.HttpHeaders.CONTENT_RANGE,
              org.springframework.http.HttpHeaders.CONTENT_TYPE,
              org.springframework.http.HttpHeaders.COOKIE,
              org.springframework.http.HttpHeaders.DATE,
              org.springframework.http.HttpHeaders.ETAG,
              org.springframework.http.HttpHeaders.EXPECT,
              org.springframework.http.HttpHeaders.EXPIRES,
              org.springframework.http.HttpHeaders.FROM,
              org.springframework.http.HttpHeaders.HOST,
              org.springframework.http.HttpHeaders.IF_MATCH,
              org.springframework.http.HttpHeaders.IF_MODIFIED_SINCE,
              org.springframework.http.HttpHeaders.IF_NONE_MATCH,
              org.springframework.http.HttpHeaders.IF_RANGE,
              org.springframework.http.HttpHeaders.IF_UNMODIFIED_SINCE,
              org.springframework.http.HttpHeaders.LAST_MODIFIED,
              org.springframework.http.HttpHeaders.LINK,
              org.springframework.http.HttpHeaders.LOCATION,
              org.springframework.http.HttpHeaders.MAX_FORWARDS,
              org.springframework.http.HttpHeaders.ORIGIN,
              org.springframework.http.HttpHeaders.PRAGMA,
              org.springframework.http.HttpHeaders.PROXY_AUTHENTICATE,
              org.springframework.http.HttpHeaders.PROXY_AUTHORIZATION,
              org.springframework.http.HttpHeaders.RANGE,
              org.springframework.http.HttpHeaders.REFERER,
              org.springframework.http.HttpHeaders.RETRY_AFTER,
              org.springframework.http.HttpHeaders.SERVER,
              org.springframework.http.HttpHeaders.SET_COOKIE,
              org.springframework.http.HttpHeaders.SET_COOKIE2,
              org.springframework.http.HttpHeaders.TE,
              org.springframework.http.HttpHeaders.TRAILER,
              org.springframework.http.HttpHeaders.TRANSFER_ENCODING,
              org.springframework.http.HttpHeaders.UPGRADE,
              org.springframework.http.HttpHeaders.USER_AGENT,
              org.springframework.http.HttpHeaders.VARY,
              org.springframework.http.HttpHeaders.VIA,
              org.springframework.http.HttpHeaders.WARNING,
              org.springframework.http.HttpHeaders.WWW_AUTHENTICATE)
          .stream()
          .map(String::toLowerCase)
          .collect(Collectors.toSet());
}
