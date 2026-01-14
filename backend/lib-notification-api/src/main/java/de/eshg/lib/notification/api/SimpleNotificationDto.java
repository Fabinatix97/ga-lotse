/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.api;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = SimpleNotificationDto.SCHEMA_NAME)
public record SimpleNotificationDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    Instant readAt,
    BusinessModule businessModule,
    @NotNull String title,
    @NotNull String message)
    implements AbstractNotificationDto {
  public static final String SCHEMA_NAME = "SimpleNotification";
}
