/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.model;

import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * Represents a logical GDT Object.
 *
 * <p>An object serves as a container for other fields and objects. It is typically defined by:
 *
 * <ol>
 *   <li>An Attribute Tag (81xx) that introduces the object (e.g., 8145 for Patient).
 *   <li>An Object Start identifier (8002) with the Object ID (e.g., Obj_0045).
 *   <li>A list of content elements (Fields or nested Objects).
 *   <li>An Object End identifier (8003) with the matching Object ID.
 * </ol>
 *
 * @param attributeTag The tag introducing the object.
 *     <p>This is {@code null} for technical objects like the root Record (starts with 8000), which
 *     acts as a container but lacks an introducing attribute field.
 *     <p>This is <b>non-null</b> for standard objects, e.g., "8145" for a Patient object, which
 *     precedes the object start (8002).
 * @param attributeName The name of the attribute.
 * @param objectId The unique object identifier (e.g., "Obj_0045").
 * @param elements The content of the object.
 */
public record GdtObject(
    String attributeTag, String attributeName, String objectId, List<GdtElement> elements)
    implements GdtElement {

  public GdtObject {
    if (elements.isEmpty()) {
      throw new IllegalStateException("GDT Object must not be empty (ID: " + objectId + ").");
    }
    elements = Collections.unmodifiableList(elements);
  }

  public static Predicate<GdtElement> isInstance() {
    return GdtObject.class::isInstance;
  }

  public static Function<GdtElement, GdtObject> cast() {
    return GdtObject.class::cast;
  }

  /**
   * @return All direct child fields of this object.
   */
  public List<GdtField> getFields() {
    return elements.stream().filter(GdtField.isInstance()).map(GdtField.cast()).toList();
  }

  /**
   * @return All direct child objects of this object.
   */
  public List<GdtObject> getObjects() {
    return elements.stream().filter(GdtObject.isInstance()).map(GdtObject.cast()).toList();
  }

  @Override
  public String getTag() {
    return attributeTag;
  }
}
