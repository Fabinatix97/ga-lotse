/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context.element;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistAudioContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistCheckboxContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistImageContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistMultiSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistSingleSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistTextElementContextDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Objects;
import java.util.UUID;

@Schema(
    name = "CLElementContext",
    discriminatorMapping = {
      @DiscriminatorMapping(value = ElementType.AUDIO, schema = ChecklistAudioContextDto.class),
      @DiscriminatorMapping(
          value = ElementType.CHECKBOX,
          schema = ChecklistCheckboxContextDto.class),
      @DiscriminatorMapping(
          value = ElementType.MULTI_SELECT,
          schema = ChecklistMultiSelectContextDto.class),
      @DiscriminatorMapping(value = ElementType.IMAGE, schema = ChecklistImageContextDto.class),
      @DiscriminatorMapping(
          value = ElementType.SINGLE_SELECT,
          schema = ChecklistSingleSelectContextDto.class),
      @DiscriminatorMapping(
          value = ElementType.SEPARATOR,
          schema = ChecklistSeparatorContextDto.class),
      @DiscriminatorMapping(
          value = ElementType.TEXT,
          schema = ChecklistTextElementContextDto.class),
    })
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(value = ChecklistAudioContextDto.class, name = ElementType.AUDIO),
  @Type(value = ChecklistCheckboxContextDto.class, name = ElementType.CHECKBOX),
  @Type(value = ChecklistMultiSelectContextDto.class, name = ElementType.MULTI_SELECT),
  @Type(value = ChecklistImageContextDto.class, name = ElementType.IMAGE),
  @Type(value = ChecklistSingleSelectContextDto.class, name = ElementType.SINGLE_SELECT),
  @Type(value = ChecklistSeparatorContextDto.class, name = ElementType.SEPARATOR),
  @Type(value = ChecklistTextElementContextDto.class, name = ElementType.TEXT)
})
public abstract class ChecklistElementContextDto {

  protected ChecklistElementContextDto() {}

  @NotNull private UUID id;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ChecklistElementContextDto that = (ChecklistElementContextDto) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }
}
