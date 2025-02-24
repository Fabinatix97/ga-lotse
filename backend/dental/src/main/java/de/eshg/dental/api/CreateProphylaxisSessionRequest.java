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

public record CreateProphylaxisSessionRequest(
    @NotNull Instant dateAndTime,
    @NotNull UUID institutionId,
    @NotBlank String groupName,
    @NotNull ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    DentitionTypeDto dentitionType,
    FluoridationVarnishDto fluoridationVarnish,
    @NotEmpty(message = "At least one dentist is required") List<UUID> dentistIds,
    @NotEmpty(message = "At least one zfa is required") List<UUID> zfaIds)
    implements ProphylaxisSessionRequest {
  public CreateProphylaxisSessionRequest(
      Instant dateAndTime,
      UUID institutionId,
      String groupName,
      ProphylaxisTypeDto type,
      List<UUID> dentistIds,
      List<UUID> zfaIds) {
    this(dateAndTime, institutionId, groupName, type, false, null, null, dentistIds, zfaIds);
  }
}
