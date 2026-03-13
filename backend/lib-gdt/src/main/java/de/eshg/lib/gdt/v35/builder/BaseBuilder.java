/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.builder;

import de.eshg.lib.gdt.v35.model.GdtElement;
import de.eshg.lib.gdt.v35.model.GdtField;
import de.eshg.lib.gdt.v35.model.GdtObject;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

/**
 * Base class for all GDT object builders.
 *
 * <p>Implements the fluent interface pattern to construct the hierarchical structure of GDT
 * records. Manages the list of {@link GdtElement}s (fields and nested objects).
 *
 * @param <T> The concrete type of the builder (Self-type pattern).
 */
abstract class BaseBuilder<T extends BaseBuilder<T>> {

  protected final List<GdtElement> elements = new ArrayList<>();

  protected abstract T self();

  /**
   * Adds a simple field to the current object.
   *
   * @param tag The 4-digit GDT tag (field identifier), e.g., "3000".
   * @param value The value of the field.
   * @return This builder instance.
   */
  public T addField(String tag, String value) {
    elements.add(new GdtField(tag, value));
    return self();
  }

  /**
   * Adds a nested object to the current object structure.
   *
   * <p>In GDT 3.5, objects are typically introduced by an "Attribute Tag" (81xx) followed by the
   * Object Start (8002) and Object End (8003).
   *
   * <p>Note: It is not permissible to add an empty object (one without any fields or nested
   * objects).
   *
   * @param attributeTag The attribute tag introducing the object (e.g., "8145" for Patient).
   * @param attributeName The descriptive name of the attribute (e.g., "Patient").
   * @param objectId The unique object identifier used in 8002/8003 (e.g., "Obj_0045").
   * @param builder The builder instance for the nested object.
   * @param config A consumer to configure the nested object's fields.
   * @param <B> The type of the nested builder.
   * @return This builder instance.
   * @throws IllegalStateException If the configured object is empty.
   */
  protected <B extends BaseBuilder<B>> T addObject(
      String attributeTag, String attributeName, String objectId, B builder, Consumer<B> config) {

    config.accept(builder);
    if (builder.elements.isEmpty()) {
      throw new IllegalStateException(
          "GDT Object must not be empty. Ensure the configuration consumer adds "
              + "at least one field or nested object (ID: "
              + objectId
              + ").");
    }
    elements.add(new GdtObject(attributeTag, attributeName, objectId, builder.elements));
    return self();
  }

  /**
   * Adds an object without a preceding attribute line (technical or "naked" object).
   *
   * <p>In GDT 3.5, objects are almost always preceded by an Object Attribute (a field in the range
   * 8100-8299, e.g., "8145 Patient") which identifies the object's role before the actual object
   * data (8002 Obj_0045) begins.
   *
   * <p>This helper exists for:
   *
   * <ul>
   *   <li><b>Specification Compliance:</b> Allowing "naked" objects (8002/8003 tags) in custom or
   *       deeply nested contexts where the role is implicit. Note that the object must still
   *       contain elements; completely empty objects (only 8002/8003) are forbidden.
   *   <li><b>Technical Groupings:</b> Creating generic containers that don't require a descriptive
   *       label in the stream.
   *   <li><b>Future Proofing:</b> Handling variants where redundant attribute fields might be
   *       omitted.
   * </ul>
   *
   * <b>Sample Usage:</b>
   *
   * <pre>{@code
   * public CustomRecordBuilder addInternalMetadata(Consumer<MetadataBuilder> config) {
   *     // Results in 8002 Obj_META ... 8003 Obj_META without a preceding 81xx field.
   *     return addObject("Obj_META", new MetadataBuilder(), config);
   * }
   * }</pre>
   *
   * @param objectId The ID for the object start (8002) and end (8003).
   * @param builder The specialized builder for the object's contents.
   * @param config A consumer to configure the builder.
   * @param <B> The type of the sub-builder.
   * @return This builder instance.
   * @throws IllegalStateException If the configured object is empty.
   */
  protected <B extends BaseBuilder<B>> T addObject(String objectId, B builder, Consumer<B> config) {
    return addObject(null, null, objectId, builder, config);
  }
}
