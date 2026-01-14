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

@Schema(name = "UpdateChecklistAudio")
public class UpdateChecklistAudioDto extends UpdateChecklistElementDto {
  private UUID audioExternalId;

  @JsonCreator
  public UpdateChecklistAudioDto(
      @NotNull @JsonProperty("id") UUID id,
      @Nullable @JsonProperty("incident") Boolean incident,
      @Nullable @JsonProperty("audio") UUID audioExternalId) {
    super(id, incident);
    this.audioExternalId = audioExternalId;
  }

  public UpdateChecklistAudioDto(@NotNull @JsonProperty("id") UUID id) {
    this(id, null, null);
  }

  public UpdateChecklistAudioDto(
      @NotNull @JsonProperty("id") UUID id, @JsonProperty("incident") Boolean incident) {
    this(id, incident, null);
  }

  public UUID getAudioExternalId() {
    return this.audioExternalId;
  }

  public void setAudioExternalId(UUID audioExternalId) {
    this.audioExternalId = audioExternalId;
  }
}
