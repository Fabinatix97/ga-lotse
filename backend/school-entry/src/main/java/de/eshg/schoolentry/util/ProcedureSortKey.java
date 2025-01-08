/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

public enum ProcedureSortKey {
  ID(false),
  DATE_OF_BIRTH(true),
  FIRSTNAME(true),
  LASTNAME(true),
  SCHOOL_YEAR(false),
  PROCEDURE_TYPE(false),
  APPOINTMENT_START(false),
  CREATED_AT(false),
  MODIFIED_AT(false);

  private final boolean personAttribute;

  ProcedureSortKey(boolean personAttribute) {
    this.personAttribute = personAttribute;
  }

  public boolean isPersonAttribute() {
    return personAttribute;
  }
}
