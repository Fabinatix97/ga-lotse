/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.element.ChecklistElementDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "CLField")
public abstract class ChecklistFieldDto extends ChecklistElementDto {

  private @NotNull UUID id;

  private Boolean isIncident;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Boolean getIncident() {
    return isIncident;
  }

  public void setIncident(Boolean incident) {
    isIncident = incident;
  }
}
