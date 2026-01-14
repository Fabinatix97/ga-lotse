/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model.element;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "EditorElementChapter")
public class EditorElementChapterDto extends EditorElementDto {

  @NotNull private final String title;

  @JsonCreator
  public EditorElementChapterDto(
      @NotNull @JsonProperty("id") UUID id,
      @NotNull @JsonProperty("editable") boolean editable,
      @NotNull @JsonProperty("moveable") boolean moveable,
      @NotNull @JsonProperty("deletable") boolean deletable,
      @NotNull @JsonProperty("highlighted") boolean highlighted,
      @JsonProperty("referenceID") UUID referenceID,
      @NotNull @JsonProperty("title") String title) {
    super(id, editable, moveable, deletable, highlighted, referenceID);
    this.title = title;
  }

  @Override
  public EditorElementType getType() {
    return EditorElementType.CHAPTER;
  }

  public String getTitle() {
    return title;
  }
}
