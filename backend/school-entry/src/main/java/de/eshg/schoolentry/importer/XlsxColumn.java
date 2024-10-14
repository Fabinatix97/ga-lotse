/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import java.util.EnumSet;

public interface XlsxColumn {

  String STATUS_COLUMN_HEADER = "Importstatus";
  String PROCEDURE_COLUMN_HEADER = "Vorgangs-ID";
  String REFERENCE_COLUMN_HEADER = "Referenz-ID";

  int STATUS_COLUMN_HEADER_WIDTH = 20;
  int PROCEDURE_COLUMN_WIDTH = 36;

  enum Necessity {
    REQUIRED,
    OPTIONAL,
    // Note: Columns may only be added at the end, otherwise we would overwrite existing columns
    ADD_IF_MISSING,
    ;
  }

  String getHeader();

  Necessity getNecessity();

  default boolean isOptional() {
    return EnumSet.of(Necessity.OPTIONAL, Necessity.ADD_IF_MISSING).contains(getNecessity());
  }

  default boolean shouldAddIfMissing() {
    return getNecessity() == Necessity.ADD_IF_MISSING;
  }

  int getColumnWidth();
}
