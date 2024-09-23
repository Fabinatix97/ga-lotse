/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.inspection.checklist.api.element.field.ChecklistAudioFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistCheckboxFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistImageFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistMultiSelectFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistSingleSelectFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistTextFieldDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "CLElement",
    discriminatorMapping = {
      @DiscriminatorMapping(value = ElementType.AUDIO, schema = ChecklistAudioFieldDto.class),
      @DiscriminatorMapping(value = ElementType.CHECKBOX, schema = ChecklistCheckboxFieldDto.class),
      @DiscriminatorMapping(
          value = ElementType.MULTI_SELECT,
          schema = ChecklistMultiSelectFieldDto.class),
      @DiscriminatorMapping(value = ElementType.IMAGE, schema = ChecklistImageFieldDto.class),
      @DiscriminatorMapping(
          value = ElementType.SINGLE_SELECT,
          schema = ChecklistSingleSelectFieldDto.class),
      @DiscriminatorMapping(
          value = ElementType.SEPARATOR,
          schema = ChecklistSeparatorElementDto.class),
      @DiscriminatorMapping(value = ElementType.TEXT, schema = ChecklistTextFieldDto.class),
    })
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(value = ChecklistAudioFieldDto.class, name = ElementType.AUDIO),
  @Type(value = ChecklistCheckboxFieldDto.class, name = ElementType.CHECKBOX),
  @Type(value = ChecklistMultiSelectFieldDto.class, name = ElementType.MULTI_SELECT),
  @Type(value = ChecklistImageFieldDto.class, name = ElementType.IMAGE),
  @Type(value = ChecklistSingleSelectFieldDto.class, name = ElementType.SINGLE_SELECT),
  @Type(value = ChecklistSeparatorElementDto.class, name = ElementType.SEPARATOR),
  @Type(value = ChecklistTextFieldDto.class, name = ElementType.TEXT)
})
public abstract class ChecklistElementDto {}
