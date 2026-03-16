/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.model;

import de.eshg.lib.gdt.GdtRecord;
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
public record Gdt35Record(String recordType, List<Gdt35Element> elements) implements GdtRecord {

  public Gdt35Record {
    elements = Collections.unmodifiableList(elements);
  }

  /**
   * @return All direct child fields of this record.
   */
  public List<Gdt35Field> getFields() {
    return elements.stream().filter(Gdt35Field.isInstance()).map(Gdt35Field.cast()).toList();
  }

  /**
   * @return All direct child objects of this record.
   */
  public List<Gdt35Object> getObjects() {
    return elements.stream().filter(Gdt35Object.isInstance()).map(Gdt35Object.cast()).toList();
  }
}
