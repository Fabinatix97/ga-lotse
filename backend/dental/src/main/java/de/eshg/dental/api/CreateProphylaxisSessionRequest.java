/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreateProphylaxisSessionRequest(
    @NotNull Instant dateAndTime,
    @NotNull int schoolYear,
    @NotNull UUID institutionId,
    String groupName,
    ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    DentitionTypeDto dentitionType,
    FluoridationVarnishDto fluoridationVarnish,
    @NotNull List<UUID> dentistIds,
    @NotNull List<UUID> zfaIds)
    implements ProphylaxisSessionRequest {
  public CreateProphylaxisSessionRequest(
      Instant dateAndTime,
      int schoolYear,
      UUID institutionId,
      String groupName,
      ProphylaxisTypeDto type,
      List<UUID> dentistIds,
      List<UUID> zfaIds) {
    this(
        dateAndTime,
        schoolYear,
        institutionId,
        groupName,
        type,
        false,
        null,
        null,
        dentistIds,
        zfaIds);
  }
}
