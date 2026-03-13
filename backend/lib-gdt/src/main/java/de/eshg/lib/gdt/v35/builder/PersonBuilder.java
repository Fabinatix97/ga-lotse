/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.builder;

/**
 * Builder for Person demographic data (Obj_0047 / Obj_Person).
 *
 * <p>Standard LDT/GDT object containing personal details like name, date of birth, and gender.
 */
public class PersonBuilder extends BaseBuilder<PersonBuilder> {

  @Override
  protected PersonBuilder self() {
    return this;
  }

  /**
   * Sets the Last Name (3101).
   *
   * @param value The surname of the person.
   * @return This builder instance.
   */
  public PersonBuilder lastName(String value) {
    return addField("3101", value);
  }

  /**
   * Sets the First Name (3102).
   *
   * @param value The given name of the person.
   * @return This builder instance.
   */
  public PersonBuilder firstName(String value) {
    return addField("3102", value);
  }

  /**
   * Sets the Date of Birth (3103).
   *
   * @param value The birthdate in format "ddMMyyyy" (e.g., "24121980").
   * @return This builder instance.
   */
  public PersonBuilder birthDate(String value) {
    return addField("3103", value);
  }

  /**
   * Sets the Title (3104).
   *
   * @param value The academic or noble title (e.g., "Dr. med.").
   * @return This builder instance.
   */
  public PersonBuilder title(String value) {
    return addField("3104", value);
  }

  /**
   * Sets the Insurance Number (3105).
   *
   * @param value The social security/insurance number (Versichertennummer).
   * @return This builder instance.
   */
  public PersonBuilder insuranceNumber(String value) {
    return addField("3105", value);
  }

  /**
   * Sets the Gender (3110).
   *
   * <p>In GDT 3.5, this uses a letter code:
   *
   * <ul>
   *   <li>"M" = Male (Männlich)
   *   <li>"W" = Female (Weiblich)
   *   <li>"U" = Unknown (Unbekannt)
   *   <li>"D" = Diverse (Divers)
   * </ul>
   *
   * @param value The gender code.
   * @return This builder instance.
   */
  public PersonBuilder gender(String value) {
    return addField("3110", value);
  }
}
