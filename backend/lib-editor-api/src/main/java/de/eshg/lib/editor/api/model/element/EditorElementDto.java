/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.lib.editor.api.model.element.EditorElementType.ElementType;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(
    name = "EditorElement",
    discriminatorMapping = {
      @DiscriminatorMapping(
          value = ElementType.TOPLEVEL_TITLE,
          schema = EditorElementTopLevelTitleDto.class),
      @DiscriminatorMapping(value = ElementType.CHAPTER, schema = EditorElementChapterDto.class),
      @DiscriminatorMapping(value = ElementType.SECTION, schema = EditorElementSectionDto.class),
      @DiscriminatorMapping(
          value = ElementType.QUESTION_AND_ANSWERS,
          schema = EditorElementQADto.class),
      @DiscriminatorMapping(value = ElementType.TEXT, schema = EditorElementTextDto.class),
      @DiscriminatorMapping(
          value = ElementType.TEXT_BLOCK,
          schema = EditorElementTextBlockDto.class),
      @DiscriminatorMapping(
          value = ElementType.FULL_TEXT_BLOCK,
          schema = EditorElementFullTextBlockDto.class),
      @DiscriminatorMapping(value = ElementType.IMAGES, schema = EditorElementImagesDto.class),
      @DiscriminatorMapping(value = ElementType.AUDIOS, schema = EditorElementAudiosDto.class),
      @DiscriminatorMapping(
          value = ElementType.SEPARATOR,
          schema = EditorElementSeparatorDto.class),
    })
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @Type(value = EditorElementTopLevelTitleDto.class, name = ElementType.TOPLEVEL_TITLE),
  @Type(value = EditorElementChapterDto.class, name = ElementType.CHAPTER),
  @Type(value = EditorElementSectionDto.class, name = ElementType.SECTION),
  @Type(value = EditorElementQADto.class, name = ElementType.QUESTION_AND_ANSWERS),
  @Type(value = EditorElementTextDto.class, name = ElementType.TEXT),
  @Type(value = EditorElementTextBlockDto.class, name = ElementType.TEXT_BLOCK),
  @Type(value = EditorElementFullTextBlockDto.class, name = ElementType.FULL_TEXT_BLOCK),
  @Type(value = EditorElementImagesDto.class, name = ElementType.IMAGES),
  @Type(value = EditorElementSeparatorDto.class, name = ElementType.SEPARATOR),
  @Type(value = EditorElementAudiosDto.class, name = ElementType.AUDIOS),
})
public abstract class EditorElementDto {

  @NotNull private final UUID id;
  @NotNull private final boolean editable;
  @NotNull private final boolean moveable;
  @NotNull private final boolean deletable;
  @NotNull private final boolean highlighted;
  private final UUID referenceID;

  @JsonCreator
  protected EditorElementDto(
      @NotNull @JsonProperty("id") UUID id,
      @NotNull @JsonProperty("editable") boolean editable,
      @NotNull @JsonProperty("moveable") boolean moveable,
      @NotNull @JsonProperty("deletable") boolean deletable,
      @NotNull @JsonProperty("highlighted") boolean highlighted,
      @JsonProperty("referenceID") UUID referenceID) {
    this.id = id;
    this.editable = editable;
    this.moveable = moveable;
    this.deletable = deletable;
    this.highlighted = highlighted;
    this.referenceID = referenceID;
  }

  @Hidden
  @NotNull
  @JsonProperty("@type")
  public abstract EditorElementType getType();

  public UUID getId() {
    return id;
  }

  public boolean isEditable() {
    return editable;
  }

  public boolean isMoveable() {
    return moveable;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public boolean isHighlighted() {
    return highlighted;
  }

  public UUID getReferenceID() {
    return referenceID;
  }
}
