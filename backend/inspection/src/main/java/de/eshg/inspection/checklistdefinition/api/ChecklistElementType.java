/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ChecklistElementType")
public enum ChecklistElementType {
  SEPARATOR(ElementType.SEPARATOR),
  TEXT(ElementType.TEXT),
  CHECKBOX(ElementType.CHECKBOX),
  MULTI_SELECT(ElementType.MULTI_SELECT),
  SINGLE_SELECT(ElementType.SINGLE_SELECT),
  IMAGE(ElementType.IMAGE),
  AUDIO(ElementType.AUDIO);

  private ChecklistElementType(String val) {
    // force equality between name of enum instance, and value of constant
    if (!this.name().equals(val))
      throw new IllegalArgumentException(
          "Incorrect use of ChecklistDefinitionElementType. Enum name (%s) doesn't fit value (%s)."
              .formatted(this.name(), val));
  }

  public static class ElementType {
    private ElementType() {}

    public static final String SEPARATOR = "SEPARATOR";
    public static final String TEXT = "TEXT";
    public static final String CHECKBOX = "CHECKBOX";
    public static final String MULTI_SELECT = "MULTI_SELECT";
    public static final String SINGLE_SELECT = "SINGLE_SELECT";
    public static final String IMAGE = "IMAGE";
    public static final String AUDIO = "AUDIO";
  }
}
