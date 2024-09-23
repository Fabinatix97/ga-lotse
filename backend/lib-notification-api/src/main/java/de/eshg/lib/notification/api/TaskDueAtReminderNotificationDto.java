/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.api;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Schema(name = TaskDueAtReminderNotificationDto.SCHEMA_NAME)
public record TaskDueAtReminderNotificationDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    Instant readAt,
    @NotNull BusinessModule businessModule,
    @NotNull String taskType,
    @NotNull Instant dueAt,
    @NotNull UUID assignedById,
    @NotNull UUID procedureId)
    implements AbstractProcedureNotificationDto {

  public static final String SCHEMA_NAME = "TaskDueAtReminderNotification";

  @Override
  public Set<UUID> getResolvableUserIds() {
    return Set.of(assignedById);
  }
}
