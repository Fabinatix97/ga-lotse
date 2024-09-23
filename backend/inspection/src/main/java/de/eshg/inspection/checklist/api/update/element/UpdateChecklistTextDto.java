/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "UpdateChecklistText")
public class UpdateChecklistTextDto extends UpdateChecklistElementDto {

  private final String input;

  @JsonCreator
  public UpdateChecklistTextDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("input") String input,
      @Nullable @JsonProperty("incident") Boolean incident) {
    super(id, incident);
    this.input = input;
  }

  public UpdateChecklistTextDto(
      @NotNull @JsonProperty("id") UUID id, @Nullable @JsonProperty("input") String input) {
    this(id, input, null);
  }

  @Nullable
  public String getInput() {
    return input;
  }
}
