/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

public enum CoverLetterType {
  FIRST_LETTER_CHILD_DAY_CARE("first_letter_child_day_care.ftlx"),
  FIRST_LETTER_EMPLOYEE("first_letter_employee.ftlx"),
  FIRST_LETTER_STUDENT_MINOR("first_letter_student_minor.ftlx"),
  FIRST_LETTER_STUDENT_OF_AGE("first_letter_student_of_age.ftlx"),
  SECOND_LETTER_CHILD_DAY_CARE("second_letter_child_day_care.ftlx"),
  SECOND_LETTER_EMPLOYEE("second_letter_employee.ftlx"),
  SECOND_LETTER_STUDENT_MINOR("second_letter_student_minor.ftlx"),
  SECOND_LETTER_STUDENT_OF_AGE("second_letter_student_of_age.ftlx");

  private final String template;

  CoverLetterType(String template) {
    this.template = template;
  }

  public String getTemplate() {
    return template;
  }
}
