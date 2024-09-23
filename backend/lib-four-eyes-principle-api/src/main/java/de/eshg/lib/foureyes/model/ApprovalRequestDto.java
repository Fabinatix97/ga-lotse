/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.model.HasResolvableUserIds;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.*;

@Schema(name = "ApprovalRequest")
public record ApprovalRequestDto(
    @NotNull UUID approvalRequestId,
    @NotNull ApprovalRequestStatusDto status,
    @NotNull Instant createdAt,
    @NotNull UUID createdBy,
    @NotNull String reason,
    UUID decidedBy,
    Instant decidedAt,
    DecisionDto decision,
    @NotNull OperationDto operation,
    @Valid ApprovalRequestEntityDto entity)
    implements HasResolvableUserIds {
  @Override
  @JsonIgnore
  public Set<UUID> getResolvableUserIds() {
    Set<UUID> uuids = new LinkedHashSet<>();
    uuids.add(createdBy);
    uuids.addAll(entity.getResolvableUserIds());
    return uuids;
  }
}
