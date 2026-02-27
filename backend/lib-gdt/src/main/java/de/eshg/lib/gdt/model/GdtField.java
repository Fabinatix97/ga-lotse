/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.model;

import java.util.function.Function;
import java.util.function.Predicate;

/**
 * Represents a single GDT field (Line).
 *
 * <p>A field consists of a 4-digit tag (Identifier) and a value. Example: "3101" (Tag) +
 * "Mustermann" (Value).
 *
 * @param tag The 4-digit field identifier.
 * @param value The content of the field.
 */
public record GdtField(String tag, String value) implements GdtElement {

  public static Predicate<GdtElement> isInstance() {
    return GdtField.class::isInstance;
  }

  public static Function<GdtElement, GdtField> cast() {
    return GdtField.class::cast;
  }

  @Override
  public String getTag() {
    return tag;
  }
}
