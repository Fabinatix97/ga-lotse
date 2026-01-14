/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;

public class RedirectToAuthorizationEndpoint {

  private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
  private final String path;

  public RedirectToAuthorizationEndpoint(String path) {
    this.path = path;
  }

  public void redirect(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    redirectStrategy.sendRedirect(request, response, path);
  }
}
