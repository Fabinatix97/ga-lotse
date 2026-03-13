/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class FileIoRateLimitInterceptor implements HandlerInterceptor {

  private final FileIoRateLimiter fileIoRateLimiter;

  FileIoRateLimitInterceptor(FileIoRateLimiter fileIoRateLimiter) {
    this.fileIoRateLimiter = fileIoRateLimiter;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {
    FileIoRateLimiter.Endpoint endpoint =
        switch (request.getMethod()) {
          case "PUT" -> FileIoRateLimiter.Endpoint.PUT_INPUT_FILE;
          case "GET" -> FileIoRateLimiter.Endpoint.GET_OUTPUT_FILE;
          case "DELETE" -> FileIoRateLimiter.Endpoint.DELETE_FILES;
          default -> null;
        };
    if (endpoint != null) {
      fileIoRateLimiter.checkRateLimit(endpoint);
    }
    return true;
  }
}
