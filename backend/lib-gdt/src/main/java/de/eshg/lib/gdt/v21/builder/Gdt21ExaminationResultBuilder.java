/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.builder;

import de.eshg.lib.gdt.v21.codec.Gdt21Constants;
import de.eshg.lib.gdt.v21.model.Gdt21Field;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Builds examination-result fields for GDT 2.10 type 6310 records. */
public class Gdt21ExaminationResultBuilder {

  private final List<Gdt21Field> fields = new ArrayList<>();
  private final Set<String> usedSingleInstanceTags = new HashSet<>();

  /** Field 6200 — examination date formatted as DDMMYYYY. */
  public Gdt21ExaminationResultBuilder examinationDate(LocalDate date) {
    addSingleInstance("6200", date.format(Gdt21Constants.DATE_FMT));
    return this;
  }

  /** Field 6201 — examination time formatted as HHMMSS. */
  public Gdt21ExaminationResultBuilder examinationTime(LocalTime time) {
    addSingleInstance("6201", time.format(Gdt21Constants.TIME_FMT));
    return this;
  }

  /** Field 8410 — test identification (e.g. {@code "OSCILLA"}, {@code "PERIDATA"}). */
  public Gdt21ExaminationResultBuilder testIdentification(String testId) {
    addSingleInstance("8410", testId);
    return this;
  }

  /** Field 8437 — data format (metadata about the data stream). */
  public Gdt21ExaminationResultBuilder dataFormat(String format) {
    addSingleInstance("8437", format);
    return this;
  }

  /**
   * Field 8438 — data stream (raw measurement values). May be called multiple times for multi-line
   * data.
   */
  public Gdt21ExaminationResultBuilder dataStream(String data) {
    fields.add(new Gdt21Field("8438", data));
    return this;
  }

  /** Field 6227 — comment (max 60 chars). */
  public Gdt21ExaminationResultBuilder comment(String comment) {
    requireMaxLength("6227", comment, 60);
    addSingleInstance("6227", comment);
    return this;
  }

  List<Gdt21Field> build() {
    return List.copyOf(fields);
  }

  private void addSingleInstance(String tag, String value) {
    if (!usedSingleInstanceTags.add(tag)) {
      throw new IllegalStateException("Field " + tag + " already set");
    }
    fields.add(new Gdt21Field(tag, value));
  }

  private static void requireMaxLength(String tag, String value, int max) {
    if (value != null && value.length() > max) {
      throw new IllegalArgumentException(
          "Field " + tag + " exceeds maximum length " + max + ": " + value.length());
    }
  }
}
