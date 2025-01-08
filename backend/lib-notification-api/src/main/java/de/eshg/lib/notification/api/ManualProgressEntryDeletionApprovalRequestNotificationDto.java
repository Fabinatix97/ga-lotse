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

@Schema(name = ManualProgressEntryDeletionApprovalRequestNotificationDto.SCHEMA_NAME)
public record ManualProgressEntryDeletionApprovalRequestNotificationDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    Instant readAt,
    BusinessModule businessModule,
    @NotNull UUID createdBy,
    @NotNull UUID procedureId,
    @NotNull String manualProgressEntryType)
    implements AbstractProcedureNotificationWithCreatorDto {

  public static final String SCHEMA_NAME = "ProgressEntryDeletionApprovalRequestNotification";
}
