/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UpdateProphylaxisSessionRequest(
    @NotNull long version,
    @NotNull UUID institutionId,
    @NotNull Instant dateAndTime,
    @NotBlank String groupName,
    @NotNull ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    FluoridationVarnishDto fluoridationVarnish,
    @NotEmpty List<UUID> dentistIds,
    @NotEmpty List<UUID> zfaIds)
    implements ProphylaxisSessionRequest {
  public UpdateProphylaxisSessionRequest(
      Long version,
      UUID institutionId,
      Instant dateAndTime,
      String groupName,
      ProphylaxisTypeDto type,
      List<UUID> dentistIds,
      List<UUID> zfaIds) {
    this(version, institutionId, dateAndTime, groupName, type, false, null, dentistIds, zfaIds);
  }
}
