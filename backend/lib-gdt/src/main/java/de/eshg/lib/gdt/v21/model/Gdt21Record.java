/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.model;

import de.eshg.lib.gdt.GdtRecord;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * A flat GDT 2.10 record containing a record type and a list of fields.
 *
 * <p>GDT 2.10 records are non-hierarchical — there are no nested objects, only fields.
 */
public record Gdt21Record(String recordType, List<Gdt21Field> fields) implements GdtRecord {

  private static final Pattern RECORD_TYPE_PATTERN = Pattern.compile("\\d{4}");

  public Gdt21Record {
    if (recordType == null || !RECORD_TYPE_PATTERN.matcher(recordType).matches()) {
      throw new IllegalArgumentException(
          "recordType must be exactly 4 decimal digits, got: " + recordType);
    }
    fields = List.copyOf(fields);
  }

  /** Returns the first field matching the given tag, or empty if not found. */
  // TODO: consider replacing with a Map<String, List<Gdt21Field>> index for O(1) repeated lookups
  public Optional<Gdt21Field> getField(String tag) {
    return fields.stream().filter(f -> f.tag().equals(tag)).findFirst();
  }

  /** Returns all fields matching the given tag (for repeating fields such as 8437/8438). */
  public List<Gdt21Field> getAllFields(String tag) {
    return fields.stream().filter(f -> f.tag().equals(tag)).toList();
  }
}
