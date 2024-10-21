/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.XlsxColumn;

public enum PastProcedureListColumn implements XlsxColumn {
  LAST_NAME("Nachname"),
  FIRST_NAME("Vorname"),
  DATE_OF_BIRTH("Geburtsdatum"),
  GENDER("Geschlecht"),
  STREET("Straße"),
  HOUSE_NUMBER("Hausnummer"),
  POSTAL_CODE("PLZ"),
  CITY("Ort"),
  ADDRESS_ADDITION("Adresszusatz"),
  PROCEDURE_TYPE("Vorgangsart"),
  EXAMINATION_DATE("Untersuchungsdatum"),
  STATUS(STATUS_COLUMN_HEADER, Necessity.ADD_IF_MISSING, STATUS_COLUMN_HEADER_WIDTH),
  PROCEDURE_ID(PROCEDURE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, PROCEDURE_COLUMN_WIDTH),
  ;

  private final String header;
  private final Necessity necessity;
  private final int columnWidth;

  PastProcedureListColumn(String header, Necessity necessity, int columnWidth) {
    this.header = header;
    this.necessity = necessity;
    this.columnWidth = columnWidth;
  }

  PastProcedureListColumn(String header) {
    this(header, Necessity.REQUIRED, 0);
  }

  @Override
  public String getHeader() {
    return header;
  }

  @Override
  public Necessity getNecessity() {
    return necessity;
  }

  @Override
  public int getColumnWidth() {
    return columnWidth;
  }
}
