/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.api;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = ProcedureNotificationDto.SCHEMA_NAME)
public record ProcedureNotificationDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    Instant readAt,
    @NotNull BusinessModule businessModule,
    @NotNull String title,
    @NotNull String message,
    @NotNull UUID procedureId)
    implements AbstractProcedureNotificationDto {
  public static final String SCHEMA_NAME = "ProcedureNotification";
}
