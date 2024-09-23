/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;

@Schema(name = "AbstractNotification")
@JsonTypeInfo(use = Id.NAME, property = "@type")
@JsonSubTypes(
    value = {
      @Type(value = AbsenceNotificationDto.class, name = AbsenceNotificationDto.SCHEMA_NAME),
      @Type(value = SimpleNotificationDto.class, name = SimpleNotificationDto.SCHEMA_NAME),
      @Type(
          value = ManualProgressEntryDeletionApprovalRequestNotificationDto.class,
          name = ManualProgressEntryDeletionApprovalRequestNotificationDto.SCHEMA_NAME),
      @Type(
          value = FileDeletionApprovalRequestNotificationDto.class,
          name = FileDeletionApprovalRequestNotificationDto.SCHEMA_NAME),
      @Type(
          value = TaskDueAtReminderNotificationDto.class,
          name = TaskDueAtReminderNotificationDto.SCHEMA_NAME)
    })
public sealed interface AbstractNotificationDto
    permits AbsenceNotificationDto, AbstractProcedureNotificationDto, SimpleNotificationDto {

  @NotNull
  @JsonProperty
  UUID id();

  @NotNull
  @JsonProperty
  Instant createdAt();

  @JsonProperty
  Instant readAt();

  @JsonProperty
  BusinessModule businessModule();

  @JsonIgnore
  default Set<UUID> getResolvableUserIds() {
    return Collections.emptySet();
  }
}
