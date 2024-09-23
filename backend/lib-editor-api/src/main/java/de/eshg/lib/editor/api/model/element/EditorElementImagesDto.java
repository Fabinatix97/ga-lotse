/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "EditorElementImages")
public class EditorElementImagesDto extends EditorElementDto {

  @NotNull private final String title;
  @NotNull @Valid private final List<EditorElementImageDto> images;

  @JsonCreator
  public EditorElementImagesDto(
      @NotNull @JsonProperty("id") UUID id,
      @NotNull @JsonProperty("editable") boolean editable,
      @NotNull @JsonProperty("moveable") boolean moveable,
      @NotNull @JsonProperty("deletable") boolean deletable,
      @NotNull @JsonProperty("highlighted") boolean highlighted,
      @JsonProperty("referenceID") UUID referenceID,
      @NotNull @JsonProperty("title") String title,
      @NotNull @Valid @JsonProperty("images") List<EditorElementImageDto> images) {
    super(id, editable, moveable, deletable, highlighted, referenceID);
    this.title = title;
    this.images = images;
  }

  @Override
  public EditorElementType getType() {
    return EditorElementType.IMAGES;
  }

  public String getTitle() {
    return title;
  }

  public List<EditorElementImageDto> getImages() {
    return images;
  }
}
