/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.builder;

import java.util.function.Consumer;

/**
 * Builder for the Patient Master Data (Obj_0045 / Obj_Patient).
 *
 * <p>Contains the primary identification of the patient (ID) and links to the Person object
 * (Obj_0047) which holds the demographic details.
 */
public class Gdt35PatientBuilder extends BaseBuilder<Gdt35PatientBuilder> {

  @Override
  protected Gdt35PatientBuilder self() {
    return this;
  }

  /**
   * Sets the Patient ID (3000).
   *
   * <p>The unique identifier for the patient within the AIS/PVS system.
   *
   * @param value The patient ID (e.g., "10293").
   * @return This builder instance.
   */
  public Gdt35PatientBuilder id(String value) {
    return addField("3000", value);
  }

  // Sometimes Patient Name is directly under Patient object (Tag 3101/3102) in older versions or
  // specific contexts?
  // But usually nested in Person (8147).
  // We stick to the standard nesting 8145 -> 8147 for Person data.

  /**
   * Adds the Person demographic data (Obj_0047 / Obj_Person).
   *
   * <p>Contains name, birthdate, gender, title, etc.
   *
   * @param config A consumer to configure the {@link Gdt35PersonBuilder}.
   * @return This builder instance.
   */
  public Gdt35PatientBuilder person(Consumer<Gdt35PersonBuilder> config) {
    return addObject("8147", "Person", "Obj_0047", new Gdt35PersonBuilder(), config);
  }

  // Add other patient specific fields if needed
}
