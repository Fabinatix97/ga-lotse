/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import de.eshg.lib.xlsximport.XlsxColumn;

enum InspectionListColumn implements XlsxColumn {
  ID("ID", Necessity.OPTIONAL),
  OBJECTTYPE("Objekttyp", Necessity.REQUIRED),
  FACILITY_NAME("Name", Necessity.REQUIRED),
  FACILITY_ZIPCODE("PLZ", Necessity.REQUIRED),
  FACILITY_CITY("Ort", Necessity.REQUIRED),
  FACILITY_STREET("Straße", Necessity.REQUIRED),
  FACILITY_HOUSENUMBER("Hausnummer", Necessity.REQUIRED),
  FACILITY_EMAIL("Email", Necessity.OPTIONAL),
  FACILITY_PHONENUMBER("Telefon", Necessity.OPTIONAL),
  CONTACT_SALUTATION("Kontakt Anrede", Necessity.OPTIONAL),
  CONTACT_TITLE("Kontakt Titel", Necessity.OPTIONAL),
  CONTACT_ROLE("Kontakt Rolle", Necessity.OPTIONAL),
  CONTACT_FIRSTNAME("Kontakt Vorname", Necessity.OPTIONAL),
  CONTACT_LASTNAME("Kontakt Name", Necessity.OPTIONAL),
  CONTACT_EMAIL("Kontakt Email", Necessity.OPTIONAL),
  CONTACT_PHONENUMBER("Kontakt Telefon", Necessity.OPTIONAL),
  INSPECTED_AT("begangen am", Necessity.REQUIRED),
  INSPECTION_RESULT("Ergebnis", Necessity.REQUIRED),
  INSPECTION_INCIDENTS("Vorkommnisse", Necessity.OPTIONAL),
  STATUS(STATUS_COLUMN_HEADER, Necessity.ADD_IF_MISSING, STATUS_COLUMN_HEADER_WIDTH),
  PROCEDURE_ID(PROCEDURE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH),
  ;

  private final String header;
  private final Necessity necessity;
  private final int columnWidth;

  InspectionListColumn(String header, Necessity necessity) {
    this(header, necessity, 0);
  }

  InspectionListColumn(String header, Necessity necessity, int columnWidth) {
    this.header = header;
    this.necessity = necessity;
    this.columnWidth = columnWidth;
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
