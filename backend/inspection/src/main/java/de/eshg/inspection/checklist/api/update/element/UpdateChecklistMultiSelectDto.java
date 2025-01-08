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
import java.util.List;
import java.util.UUID;

@Schema(name = "UpdateChecklistMultiSelect")
public class UpdateChecklistMultiSelectDto extends UpdateChecklistElementDto {

  private final List<String> checkedButtonNames;

  @JsonCreator
  public UpdateChecklistMultiSelectDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("checkedButtonNames") List<String> checkedButtonNames,
      @Nullable @JsonProperty("incident") Boolean incident) {
    super(id, incident);
    this.checkedButtonNames = checkedButtonNames;
  }

  public UpdateChecklistMultiSelectDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("checkedButtonNames") List<String> checkedButtonNames) {
    this(id, checkedButtonNames, null);
  }

  @Nullable
  public List<String> getCheckedButtonNames() {
    return checkedButtonNames;
  }
}
