/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "UpdateChecklistCheckbox")
public class UpdateChecklistCheckboxDto extends UpdateChecklistElementDto {

  private final Boolean checked;

  @JsonCreator
  public UpdateChecklistCheckboxDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("checked") Boolean checked,
      @Nullable @JsonProperty("incident") Boolean incident) {
    super(id, incident);
    this.checked = checked;
  }

  public UpdateChecklistCheckboxDto(
      @NotNull @JsonProperty("id") UUID id, @Nullable @JsonProperty("checked") Boolean checked) {
    this(id, checked, null);
  }

  @Nullable
  public Boolean getChecked() {
    return checked;
  }
}
