/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element;

public enum ElementType {
  TEXT(Type.TEXT),
  TEXT_BLOCK(Type.TEXT_BLOCK);

  private ElementType(String val) {
    // force equality between name of enum instance, and value of constant
    if (!this.name().equals(val))
      throw new IllegalArgumentException(
          "Incorrect use of InformationStatementElementType. Enum name (%s) doesn't fit value (%s)."
              .formatted(this.name(), val));
  }

  public static class Type {
    private Type() {}

    public static final String TEXT = "TEXT";
    public static final String TEXT_BLOCK = "TEXT_BLOCK";
  }
}
