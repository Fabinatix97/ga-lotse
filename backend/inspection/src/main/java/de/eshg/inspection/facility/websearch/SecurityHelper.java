/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

public final class SecurityHelper {

  private SecurityHelper() {
    throw new UnsupportedOperationException("Utility class");
  }

  public static void runWithSecurityContextOfUser(UUID userId, Runnable runnable) {
    Authentication origAuth = SecurityContextHolder.getContext().getAuthentication();
    SecurityContextHolder.getContext()
        .setAuthentication(new PreAuthenticatedAuthenticationToken(userId.toString(), null));
    try {
      runnable.run();
    } finally {
      SecurityContextHolder.getContext().setAuthentication(origAuth);
    }
  }
}
