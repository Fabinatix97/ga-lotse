/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

/** Data sensitivity level. */
public enum SensitivityLevel {
  /**
   * Öffentlich (Öffentlicher Teil): Data that does not relate to a single person and can therefore
   * be published. E.g.: Number of school entries in 2020 in Frankfurt.
   */
  PUBLIC,

  /**
   * Pseudonym (Pseudonymer Teil): Data where a personal reference can’t be established without a
   * name and is not an exact date. Mostly used for statistics. E.g.: Female, 35
   */
  PSEUDONYMIZED,

  /**
   * Geschützt (Geschützter personenbezogener Teil): Data that enables a personal reference to a
   * single person even without a real name. This can be due to a combination of certain parameters
   * or the uniqueness of a parameter. E.g.: Exact birthdate of a person
   */
  PROTECTED,

  /**
   * Sensibel (Sensibler Klarnamen Teil): Data that includes real names, ethnic background or
   * specific diagnosis
   */
  SENSITIVE,

  /**
   * Hochsensibel (Hochsensibler personenbezogener Teil): Data that could place the subject at
   * severe risk of harm, such as any data in the field of psychiatry, pregnancy or infectious
   * diseases like HIV
   */
  HIGHLY_SENSITIVE,

  /**
   * Exclusively for fields that are pending assignment to a specific data protection group. These
   * fields require further consultation with the Data Protection Officer (DPO) or input from the
   * Product Owner before they can be accurately categorized.
   */
  UNDEFINED
}
