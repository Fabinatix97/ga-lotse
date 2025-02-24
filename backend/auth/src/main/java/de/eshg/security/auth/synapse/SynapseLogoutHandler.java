/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnSynapseUrl
public class SynapseLogoutHandler implements LogoutHandler {

  private final MatrixLogoutClient matrixLogoutClient;

  public SynapseLogoutHandler(MatrixLogoutClient matrixLogoutClient) {
    this.matrixLogoutClient = matrixLogoutClient;
  }

  @Override
  public void logout(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
    matrixLogoutClient.logout();
  }
}
