/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.model;

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
public record Gdt35Field(String tag, String value) implements Gdt35Element {

  public static Predicate<Gdt35Element> isInstance() {
    return Gdt35Field.class::isInstance;
  }

  public static Function<Gdt35Element, Gdt35Field> cast() {
    return Gdt35Field.class::cast;
  }

  @Override
  public String getTag() {
    return tag;
  }
}
