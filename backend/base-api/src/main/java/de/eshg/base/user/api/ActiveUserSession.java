/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record ActiveUserSession(
    @NotNull UUID sessionId,
    @NotNull String ip,
    @NotNull Instant startTime,
    @NotNull Instant lastActiveTime,
    @NotNull boolean isCurrent,
    @NotNull @Valid Device device) {
  public record Device(
      String deviceName,
      String browserName,
      String osName,
      String osVersion,
      @NotNull boolean isMobile) {}
}
