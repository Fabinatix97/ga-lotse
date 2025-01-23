/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record UpdateProphylaxisSessionRequest(
    @NotNull long version,
    @NotNull Instant dateAndTime,
    @NotBlank String groupName,
    @NotNull ProphylaxisTypeDto type,
    @NotNull boolean screening,
    FluoridationVarnishDto fluoridationVarnish)
    implements ProphylaxisSessionRequest {
  public UpdateProphylaxisSessionRequest(
      Long version, Instant dateAndTime, String groupName, ProphylaxisTypeDto type) {
    this(version, dateAndTime, groupName, type, false, null);
  }
}
