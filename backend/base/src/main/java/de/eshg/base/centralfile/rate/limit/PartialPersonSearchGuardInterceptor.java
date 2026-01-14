/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.rate.limit;

import static de.eshg.base.centralfile.rate.limit.PartialPersonSearchGuard.DEFAULT_BUCKET;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class PartialPersonSearchGuardInterceptor implements HandlerInterceptor {

  private final PartialPersonSearchGuard partialPersonSearchGuard;

  protected PartialPersonSearchGuardInterceptor(PartialPersonSearchGuard partialPersonSearchGuard) {
    this.partialPersonSearchGuard = partialPersonSearchGuard;
  }

  private String getBucketName(HttpServletRequest request) {
    String header = request.getHeader("x-eshg-cert-san");
    return header == null ? DEFAULT_BUCKET : header;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {
    if (HttpMethod.GET.matches(request.getMethod())) {
      partialPersonSearchGuard.guard(getBucketName(request));
    }
    return true;
  }
}
