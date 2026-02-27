/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.model;

import java.util.Collections;
import java.util.List;

/**
 * Represents a complete GDT Record (Data Package).
 *
 * <p>A record starts with tag 8000 (Record Type) and ends with tag 8001. It contains a sequence of
 * fields and objects.
 *
 * @param recordType The type of the record (e.g., "6301", "6310").
 * @param elements The content of the record.
 */
public record GdtRecord(String recordType, List<GdtElement> elements) {

  public GdtRecord {
    elements = Collections.unmodifiableList(elements);
  }

  /**
   * @return All direct child fields of this record.
   */
  public List<GdtField> getFields() {
    return elements.stream().filter(GdtField.isInstance()).map(GdtField.cast()).toList();
  }

  /**
   * @return All direct child objects of this record.
   */
  public List<GdtObject> getObjects() {
    return elements.stream().filter(GdtObject.isInstance()).map(GdtObject.cast()).toList();
  }
}
