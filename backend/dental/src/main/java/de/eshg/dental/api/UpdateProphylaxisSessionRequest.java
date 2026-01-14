/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UpdateProphylaxisSessionRequest(
    @NotNull long version,
    @NotNull Instant dateAndTime,
    ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    DentitionTypeDto dentitionType,
    FluoridationVarnishDto fluoridationVarnish,
    @NotNull List<UUID> dentistIds,
    @NotNull List<UUID> zfaIds)
    implements ProphylaxisSessionRequest {
  public UpdateProphylaxisSessionRequest(
      Long version,
      Instant dateAndTime,
      ProphylaxisTypeDto type,
      List<UUID> dentistIds,
      List<UUID> zfaIds) {
    this(version, dateAndTime, type, false, null, null, dentistIds, zfaIds);
  }
}
