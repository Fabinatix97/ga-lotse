/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

// Unusual naming to match the corresponding field names in frontend.
public enum SchoolEntryProcedureSortKey {
  ID,
  DATE_OF_BIRTH,
  FIRSTNAME,
  LASTNAME,
  SCHOOL_YEAR,
  TYPE,
  APPOINTMENT_START,
  CREATED_AT,
  MODIFIED_AT
}
