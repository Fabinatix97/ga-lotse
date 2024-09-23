/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

@Schema(name = "NotificationWithCreatorNameBase")
public sealed interface AbstractProcedureNotificationWithCreatorDto
    extends AbstractProcedureNotificationDto
    permits FileDeletionApprovalRequestNotificationDto,
        ManualProgressEntryDeletionApprovalRequestNotificationDto {

  @NotNull
  @JsonProperty
  UUID createdBy();

  @Override
  default Set<UUID> getResolvableUserIds() {
    return Set.of(createdBy());
  }
}
