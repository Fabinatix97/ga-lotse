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

@Schema(name = AbsenceNotificationDto.SCHEMA_NAME)
public record AbsenceNotificationDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    Instant readAt,
    @NotNull UUID absentUserId,
    @NotNull Instant absenceStart,
    @NotNull Instant absenceEnd,
    BusinessModule businessModule)
    implements AbstractNotificationDto {

  public static final String SCHEMA_NAME = "AbsenceNotification";

  public AbsenceNotificationDto(
      UUID id,
      Instant createdAt,
      Instant readAt,
      UUID absentUserId,
      Instant absenceStart,
      Instant absenceEnd) {
    this(id, createdAt, readAt, absentUserId, absenceStart, absenceEnd, null);
  }

  @Override
  public Set<UUID> getResolvableUserIds() {
    return Set.of(absentUserId());
  }
}
