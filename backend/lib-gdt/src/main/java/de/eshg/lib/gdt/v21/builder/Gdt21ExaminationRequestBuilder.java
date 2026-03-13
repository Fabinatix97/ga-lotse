/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.builder;

import de.eshg.lib.gdt.v21.model.Gdt21Field;
import java.util.ArrayList;
import java.util.List;

/** Builds examination-request fields for GDT 2.10 type 6302 records. */
public class Gdt21ExaminationRequestBuilder {

  private final List<Gdt21Field> fields = new ArrayList<>();

  /**
   * Field 8402 — test method / characteristic map (max 6 chars; e.g. {@code "AUDI"}, {@code
   * "TYMP"}, {@code "AUD100"}). May be called multiple times to request multiple test methods.
   */
  public Gdt21ExaminationRequestBuilder testMethod(String testMethod) {
    if (testMethod != null && testMethod.length() > 6) {
      throw new IllegalArgumentException(
          "Field 8402 exceeds maximum length 6: " + testMethod.length());
    }
    fields.add(new Gdt21Field("8402", testMethod));
    return this;
  }

  List<Gdt21Field> build() {
    return List.copyOf(fields);
  }
}
