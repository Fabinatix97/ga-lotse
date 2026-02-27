/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.model;

/**
 * Common interface for all GDT elements (Fields and Objects).
 *
 * <p>A GDT record consists of a list of these elements.
 */
public sealed interface GdtElement permits GdtField, GdtObject {

  /**
   * Returns the identifying tag for this element.
   *
   * <p>This is a convenience method for polymorphic extraction. The underlying properties represent
   * distinct GDT concepts:
   *
   * <ul>
   *   <li><b>GdtField</b>: Returns {@link GdtField#tag()} - the 4-digit field identifier (e.g.,
   *       "3101" for lastName, "8310" for requestId). Never null.
   *   <li><b>GdtObject</b>: Returns {@link GdtObject#attributeTag()} - the 81xx range tag
   *       introducing the object (e.g., "8145" for Patient). May be null for root records or
   *       technical objects.
   * </ul>
   *
   * <p><b>Domain Note</b>: Field tags and attribute tags serve different purposes in the GDT
   * specification. Use {@code tag()} and {@code attributeTag()} when semantic distinction matters;
   * use {@code getTag()} for unified extraction.
   *
   * @return The tag identifier, or null for objects without an attribute tag
   */
  String getTag();
}
