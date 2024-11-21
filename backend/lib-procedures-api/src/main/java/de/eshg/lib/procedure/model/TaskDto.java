/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.cronn.commons.lang.SetUtils;
import de.eshg.lib.common.BusinessModule;
import de.eshg.model.HasResolvableUserIds;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Schema(name = "Task")
public record TaskDto(
    @NotNull UUID procedureId,
    @NotNull BusinessModule businessModule,
    @NotNull UUID taskId,
    @NotNull Long version,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt,
    Instant dueAt,
    @NotNull boolean isOverdue,
    @NotNull @Size(max = 128) String summary,
    UUID assigneeId,
    UUID assignedById,
    @NotNull TaskStatusDto taskStatus,
    @NotNull TaskTypeDto taskType)
    implements HasResolvableUserIds {
  @Override
  @JsonIgnore
  public Set<UUID> getResolvableUserIds() {
    return SetUtils.orderedSet(assigneeId, assignedById);
  }
}
