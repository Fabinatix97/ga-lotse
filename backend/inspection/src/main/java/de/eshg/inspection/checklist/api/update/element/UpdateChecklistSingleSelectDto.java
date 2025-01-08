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

@Schema(name = "UpdateChecklistSingleSelect")
public class UpdateChecklistSingleSelectDto extends UpdateChecklistElementDto {

  private final String checkedButtonName;

  @JsonCreator
  public UpdateChecklistSingleSelectDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("checkedButtonName") String checkedButtonName,
      @Nullable @JsonProperty("incident") Boolean incident) {
    super(id, incident);
    this.checkedButtonName = checkedButtonName;
  }

  public UpdateChecklistSingleSelectDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("checkedButtonName") String checkedButtonName) {
    this(id, checkedButtonName, null);
  }

  @Nullable
  public String getCheckedButtonName() {
    return checkedButtonName;
  }
}
