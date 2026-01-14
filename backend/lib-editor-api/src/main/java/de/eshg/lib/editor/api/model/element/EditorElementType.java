/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model.element;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EditorElementType")
public enum EditorElementType {
  TOPLEVEL_TITLE(ElementType.TOPLEVEL_TITLE),
  CHAPTER(ElementType.CHAPTER),
  SECTION(ElementType.SECTION),
  QUESTION_AND_ANSWERS(ElementType.QUESTION_AND_ANSWERS),
  TEXT(ElementType.TEXT),
  TEXT_BLOCK(ElementType.TEXT_BLOCK),
  FULL_TEXT_BLOCK(ElementType.FULL_TEXT_BLOCK),
  IMAGES(ElementType.IMAGES),
  SEPARATOR(ElementType.SEPARATOR),
  AUDIOS(ElementType.AUDIOS);

  private EditorElementType(String val) {
    // force equality between name of enum instance, and value of constant
    if (!this.name().equals(val))
      throw new IllegalArgumentException(
          "Incorrect use of ChecklistDefinitionElementType. Enum name (%s) doesn't fit value (%s)."
              .formatted(this.name(), val));
  }

  public static class ElementType {
    private ElementType() {}

    public static final String TOPLEVEL_TITLE = "TOPLEVEL_TITLE";
    public static final String CHAPTER = "CHAPTER";
    public static final String SECTION = "SECTION";
    public static final String QUESTION_AND_ANSWERS = "QUESTION_AND_ANSWERS";
    public static final String TEXT = "TEXT";
    public static final String TEXT_BLOCK = "TEXT_BLOCK";
    public static final String FULL_TEXT_BLOCK = "FULL_TEXT_BLOCK";
    public static final String IMAGES = "IMAGES";
    public static final String SEPARATOR = "SEPARATOR";
    public static final String AUDIOS = "AUDIOS";
  }
}
