/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.builder;

import de.eshg.lib.gdt.v21.codec.Gdt21Constants;
import de.eshg.lib.gdt.v21.model.Gdt21Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Builds flat patient demographic fields for a GDT 2.10 record. */
public class Gdt21PatientBuilder {

  private final List<Gdt21Field> fields = new ArrayList<>();
  private final Set<String> usedTags = new HashSet<>();

  /** Field 3000 — patient ID (1–8 chars, required). */
  public Gdt21PatientBuilder patientId(String id) {
    requireMaxLength("3000", id, 8);
    addSingleInstance("3000", id);
    return this;
  }

  /** Field 3101 — last name (max 28 chars). */
  public Gdt21PatientBuilder lastName(String lastName) {
    requireMaxLength("3101", lastName, 28);
    addSingleInstance("3101", lastName);
    return this;
  }

  /** Field 3102 — first name (max 28 chars). */
  public Gdt21PatientBuilder firstName(String firstName) {
    requireMaxLength("3102", firstName, 28);
    addSingleInstance("3102", firstName);
    return this;
  }

  /** Field 3103 — date of birth formatted as DDMMYYYY. */
  public Gdt21PatientBuilder dateOfBirth(LocalDate date) {
    addSingleInstance("3103", date.format(Gdt21Constants.DATE_FMT));
    return this;
  }

  /** Field 3104 — title (max 15 chars). */
  public Gdt21PatientBuilder title(String title) {
    requireMaxLength("3104", title, 15);
    addSingleInstance("3104", title);
    return this;
  }

  /** Field 3106 — postal code and city (max 30 chars). */
  public Gdt21PatientBuilder postalCodeAndCity(String postalCodeAndCity) {
    requireMaxLength("3106", postalCodeAndCity, 30);
    addSingleInstance("3106", postalCodeAndCity);
    return this;
  }

  /** Field 3107 — street (max 28 chars). */
  public Gdt21PatientBuilder street(String street) {
    requireMaxLength("3107", street, 28);
    addSingleInstance("3107", street);
    return this;
  }

  /** Field 3110 — sex. */
  public Gdt21PatientBuilder sex(Gdt21Sex sex) {
    addSingleInstance("3110", sex.code());
    return this;
  }

  List<Gdt21Field> build() {
    return List.copyOf(fields);
  }

  private void addSingleInstance(String tag, String value) {
    if (!usedTags.add(tag)) {
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
