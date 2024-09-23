/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

import jakarta.annotation.Nullable;

public record KeycloakApiActiveUserSession(
    String sessionId, String ip, int startTime, int lastActiveTime, Device device) {

  public record Device(
      @Nullable String deviceName,
      @Nullable String browserName,
      @Nullable String osName,
      @Nullable String osVersion,
      boolean isMobile) {}
}
