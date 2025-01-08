/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import de.eshg.lib.xlsximport.XlsxColumn;

public enum ChildColumn implements XlsxColumn {
  LAST_NAME("Name"),
  FIRST_NAME("Vorname"),
  DATE_OF_BIRTH("Geburtsdatum"),
  GENDER("Geschlecht (Männlich = M, Weiblich = W, Divers = D, Unbekannt = U)"),
  GROUP("Gruppe"),
  STATUS(STATUS_COLUMN_HEADER, Necessity.ADD_IF_MISSING, STATUS_COLUMN_HEADER_WIDTH),
  CHILD_ID("Kind-ID", Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH),
  ;

  private final String header;
  private final Necessity necessity;
  private final int columnWidth;

  ChildColumn(String header, Necessity necessity, int columnWidth) {
    this.header = header;
    this.necessity = necessity;
    this.columnWidth = columnWidth;
  }

  ChildColumn(String header, Necessity necessity) {
    this(header, necessity, 0);
  }

  ChildColumn(String header) {
    this(header, Necessity.REQUIRED);
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
