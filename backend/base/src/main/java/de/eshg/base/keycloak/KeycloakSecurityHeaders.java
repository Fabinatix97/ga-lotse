/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

public enum KeycloakSecurityHeaders {
  CONTENT_SECURITY_POLICY(
      "contentSecurityPolicy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self';"),
  CONTENT_SECURITY_POLICY_REPORT_ONLY("contentSecurityPolicyReportOnly", ""),
  REFERRER_POLICY("referrerPolicy", "no-referrer"),
  STRICT_TRANSPORT_SECURITY("strictTransportSecurity", "max-age=31536000; includeSubDomains"),
  X_CONTENT_TYPE_OPTIONS("xContentTypeOptions", "nosniff"),
  X_FRAME_OPTIONS("xFrameOptions", "SAMEORIGIN"),
  X_ROBOTS_TAG("xRobotsTag", "none"),
  X_XXS_PROTECTION("xXSSProtection", ""),
  ;

  KeycloakSecurityHeaders(String keycloakName, String value) {
    this.keycloakName = keycloakName;
    this.value = value;
  }

  private final String keycloakName;
  private final String value;

  public String getKeycloakName() {
    return keycloakName;
  }

  public String getValue() {
    return value;
  }
}
