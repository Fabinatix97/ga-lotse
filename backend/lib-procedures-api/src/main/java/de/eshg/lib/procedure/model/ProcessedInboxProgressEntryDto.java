/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Schema(name = ProcessedInboxProgressEntryDto.SCHEMA_NAME)
@JsonTypeName(ProcessedInboxProgressEntryDto.SCHEMA_NAME)
public final class ProcessedInboxProgressEntryDto extends ProgressEntryDto {
  public static final String SCHEMA_NAME = "ProcessedInboxProgressEntry";

  @NotNull private UUID inboxProcedureId;
  @NotNull private InboxProgressEntryTypeDto inboxProgressEntryType;
  private String subject;
  private String messageText;

  @NotNull private UUID createdBy;

  public UUID getInboxProcedureId() {
    return inboxProcedureId;
  }

  public void setInboxProcedureId(UUID inboxProcedureId) {
    this.inboxProcedureId = inboxProcedureId;
  }

  public InboxProgressEntryTypeDto getInboxProgressEntryType() {
    return inboxProgressEntryType;
  }

  public void setInboxProgressEntryType(InboxProgressEntryTypeDto inboxProgressEntryType) {
    this.inboxProgressEntryType = inboxProgressEntryType;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getMessageText() {
    return messageText;
  }

  public void setMessageText(String messageText) {
    this.messageText = messageText;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  @Override
  public Set<UUID> getResolvableUserIds() {
    LinkedHashSet<UUID> userIds = new LinkedHashSet<>(super.getResolvableUserIds());
    userIds.add(getCreatedBy());
    return userIds;
  }
}
