/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.XlsxColumn;

public enum SchoolListColumn implements XlsxColumn {
  LAST_NAME("Name"),
  FIRST_NAME("Vorname"),
  DATE_OF_BIRTH("Geburtsdatum"),
  GENDER("Geschlecht (Männlich = M, Weiblich = W, Divers = D,  Unbekannt = U)"),
  STREET("Straße"),
  HOUSE_NUMBER("Hausnummer"),
  POSTAL_CODE("PLZ"),
  CITY("Ort"),
  ADDRESS_ADDITION("Adresszusatz"),
  PHONE_NUMBER("Telefonnummer"),
  EMAIL("E-Mail-Adresse", Necessity.OPTIONAL),
  ENTRY_LEVEL("Eingangsstufe (Ja = X)"),
  EARLY_EXAMINATION("Frühe Untersuchung (Ja = X)"),
  NOTE("Bemerkung", Necessity.OPTIONAL),
  STATUS(STATUS_COLUMN_HEADER, Necessity.ADD_IF_MISSING, STATUS_COLUMN_HEADER_WIDTH),
  PROCEDURE_ID(PROCEDURE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH),
  REFERENCE_ID(REFERENCE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH);

  private final String header;
  private final Necessity necessity;
  private final int columnWidth;

  SchoolListColumn(String header, Necessity necessity, int columnWidth) {
    this.header = header;
    this.necessity = necessity;
    this.columnWidth = columnWidth;
  }

  SchoolListColumn(String header, Necessity necessity) {
    this(header, necessity, 0);
  }

  SchoolListColumn(String header) {
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
