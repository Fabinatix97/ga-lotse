/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import org.springframework.util.Assert;

public final class SecFetchHeaderUtil {

  public static final String SEC_FETCH_MODE_HEADER_NAME = "Sec-Fetch-Mode";
  public static final String SEC_FETCH_SITE_HEADER_NAME = "Sec-Fetch-Site";

  private SecFetchHeaderUtil() {}

  public static void verifySecFetchSiteHeader(
      HttpServletRequest request, SecFetchSite... allowedValues) {
    String secFetchSiteHeaderValue = request.getHeader(SEC_FETCH_SITE_HEADER_NAME);
    verifySecFetchSiteHeader(secFetchSiteHeaderValue, allowedValues);
  }

  public static void verifySecFetchSiteHeader(
      String secFetchSiteHeaderValue, SecFetchSite... allowedValues) {
    Assert.notEmpty(allowedValues, "allowedValues must not be empty");
    if (Arrays.stream(allowedValues)
        .noneMatch(allowedValue -> allowedValue.getValue().equals(secFetchSiteHeaderValue))) {
      throw new ForbiddenException(
          "Illegal value of the %s header: '%s'"
              .formatted(SEC_FETCH_SITE_HEADER_NAME, secFetchSiteHeaderValue));
    }
  }

  public static void verifySecFetchModeHeader(
      HttpServletRequest request, SecFetchMode allowedValue) {
    String secFetchModeHeaderValue = request.getHeader(SEC_FETCH_MODE_HEADER_NAME);
    verifySecFetchModeHeader(secFetchModeHeaderValue, allowedValue);
  }

  public static void verifySecFetchModeHeader(
      String secFetchModeHeaderValue, SecFetchMode allowedValue) {
    if (!allowedValue.getValue().equals(secFetchModeHeaderValue)) {
      throw new ForbiddenException(
          "Illegal value of the %s header: '%s'"
              .formatted(SEC_FETCH_MODE_HEADER_NAME, secFetchModeHeaderValue));
    }
  }
}
