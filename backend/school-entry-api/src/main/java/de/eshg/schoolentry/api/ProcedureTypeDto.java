/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SchoolEntryProcedureType",
    description =
        "Type of examination of the child. The type of examination has a number of practical implications. For instance, when an examination is carried out, what is examined and how long the examination lasts.",
    example = "REGULAR_EXAMINATION")
public enum ProcedureTypeDto {
  REGULAR_EXAMINATION,
  CAN_CHILD,
  ENTRY_LEVEL,
  DRAFT_CITIZEN_OFFICE_IMPORT,
  DRAFT_SCHOOL_IMPORT
}
