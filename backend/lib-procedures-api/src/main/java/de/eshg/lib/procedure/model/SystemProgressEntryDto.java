/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = SystemProgressEntryDto.SCHEMA_NAME)
@JsonTypeName(SystemProgressEntryDto.SCHEMA_NAME)
public final class SystemProgressEntryDto extends ProgressEntryDto {
  public static final String SCHEMA_NAME = "SystemProgressEntry";

  @CanBeLogged @NotNull private String systemProgressEntryType;
  @CanBeLogged @NotNull private TriggerTypeDto triggerType;
  private String changeDescription;

  private UUID triggeredBy;
  private String triggeredByUserFirstName;
  private String triggeredByUserLastName;

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
  public UUID getRelatedUserId() {
    return getTriggeredBy();
  }

  @Override
  public void setRelatedUserFirstName(String relatedUserFirstName) {
    setTriggeredByUserFirstName(relatedUserFirstName);
  }

  @Override
  public void setRelatedUserLastName(String relatedUserLastName) {
    setTriggeredByUserLastName(relatedUserLastName);
  }

  public String getTriggeredByUserFirstName() {
    return triggeredByUserFirstName;
  }

  public void setTriggeredByUserFirstName(String triggeredByUserFirstName) {
    this.triggeredByUserFirstName = triggeredByUserFirstName;
  }

  public String getTriggeredByUserLastName() {
    return triggeredByUserLastName;
  }

  public void setTriggeredByUserLastName(String triggeredByUserLastName) {
    this.triggeredByUserLastName = triggeredByUserLastName;
  }
}
