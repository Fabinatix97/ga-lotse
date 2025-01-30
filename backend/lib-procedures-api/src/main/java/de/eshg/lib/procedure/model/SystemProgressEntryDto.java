/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Schema(name = SystemProgressEntryDto.SCHEMA_NAME)
@JsonTypeName(SystemProgressEntryDto.SCHEMA_NAME)
public final class SystemProgressEntryDto extends ProgressEntryDto
    implements KeyDocumentAwareProgressEntryDto {
  public static final String SCHEMA_NAME = "SystemProgressEntry";

  @NotNull private String systemProgressEntryType;
  @NotNull private TriggerTypeDto triggerType;
  private String changeDescription;
  private String keyDocumentType;
  private Integer keyDocumentVersion;
  private UUID triggeredBy;
  private UUID previousFileStateId;

  public String getSystemProgressEntryType() {
    return systemProgressEntryType;
  }

  public void setSystemProgressEntryType(String systemProgressEntryType) {
    this.systemProgressEntryType = systemProgressEntryType;
  }

  public TriggerTypeDto getTriggerType() {
    return triggerType;
  }

  public void setTriggerType(TriggerTypeDto triggerType) {
    this.triggerType = triggerType;
  }

  public UUID getTriggeredBy() {
    return triggeredBy;
  }

  public void setTriggeredBy(UUID triggeredBy) {
    this.triggeredBy = triggeredBy;
  }

  public String getChangeDescription() {
    return changeDescription;
  }

  public void setChangeDescription(String changeDescription) {
    this.changeDescription = changeDescription;
  }

  @Override
  public String getKeyDocumentType() {
    return keyDocumentType;
  }

  @Override
  public Integer getKeyDocumentVersion() {
    return keyDocumentVersion;
  }

  public void setKeyDocumentVersion(Integer keyDocumentVersion) {
    this.keyDocumentVersion = keyDocumentVersion;
  }

  public void setKeyDocumentType(String keyDocumentType) {
    this.keyDocumentType = keyDocumentType;
  }

  public UUID getPreviousFileStateId() {
    return previousFileStateId;
  }

  public void setPreviousFileStateId(UUID previousFileStateId) {
    this.previousFileStateId = previousFileStateId;
  }

  @Override
  public Set<UUID> getResolvableUserIds() {
    LinkedHashSet<UUID> userIds = new LinkedHashSet<>(super.getResolvableUserIds());
    Optional.ofNullable(triggeredBy).ifPresent(userIds::add);
    return userIds;
  }
}
