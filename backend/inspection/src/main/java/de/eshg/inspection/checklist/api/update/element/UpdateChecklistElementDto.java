/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(
    name = "UpdateChecklistElement",
    discriminatorMapping = {
      @DiscriminatorMapping(
          value = ElementType.CHECKBOX,
          schema = UpdateChecklistCheckboxDto.class),
      @DiscriminatorMapping(
          value = ElementType.SINGLE_SELECT,
          schema = UpdateChecklistSingleSelectDto.class),
      @DiscriminatorMapping(
          value = ElementType.MULTI_SELECT,
          schema = UpdateChecklistMultiSelectDto.class),
      @DiscriminatorMapping(value = ElementType.TEXT, schema = UpdateChecklistTextDto.class),
      @DiscriminatorMapping(value = ElementType.IMAGE, schema = UpdateChecklistImageDto.class),
      @DiscriminatorMapping(value = ElementType.AUDIO, schema = UpdateChecklistAudioDto.class),
    })
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(value = UpdateChecklistCheckboxDto.class, name = ElementType.CHECKBOX),
  @Type(value = UpdateChecklistSingleSelectDto.class, name = ElementType.SINGLE_SELECT),
  @Type(value = UpdateChecklistMultiSelectDto.class, name = ElementType.MULTI_SELECT),
  @Type(value = UpdateChecklistTextDto.class, name = ElementType.TEXT),
  @Type(value = UpdateChecklistImageDto.class, name = ElementType.IMAGE),
  @Type(value = UpdateChecklistAudioDto.class, name = ElementType.AUDIO),
})
public abstract class UpdateChecklistElementDto {

  @NotNull private final UUID id;

  private final Boolean incident;

  @JsonCreator
  protected UpdateChecklistElementDto(
      @NotNull @JsonProperty("id") UUID id, @Nullable @JsonProperty("incident") Boolean incident) {
    this.id = id;
    this.incident = incident;
  }

  public UUID getId() {
    return id;
  }

  public Boolean isIncident() {
    return incident;
  }
}
