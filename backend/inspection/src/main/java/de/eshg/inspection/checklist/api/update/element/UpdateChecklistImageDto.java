/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "UpdateChecklistImage")
public class UpdateChecklistImageDto extends UpdateChecklistElementDto {

  private UUID imageExternalId;

  @JsonCreator
  public UpdateChecklistImageDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("incident") Boolean incident,
      @Nullable @JsonProperty("image") UUID imageExternalId) {
    super(id, incident);
    this.imageExternalId = imageExternalId;
  }

  public UpdateChecklistImageDto(@NotNull @JsonProperty("id") UUID id) {
    this(id, null, null);
  }

  public UpdateChecklistImageDto(
      @NotNull @JsonProperty("id") UUID id, @JsonProperty("incident") Boolean incident) {
    this(id, incident, null);
  }

  public UUID getImageExternalId() {
    return imageExternalId;
  }

  public void setImageExternalId(UUID imageExternalId) {
    this.imageExternalId = imageExternalId;
  }
}
