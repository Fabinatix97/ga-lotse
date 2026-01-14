/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.XlsxColumn;

public enum CitizenListColumn implements XlsxColumn {
  LAST_NAME("Nachname"),
  FIRST_NAME("Vorname"),
  STREET("Straße"),
  HOUSE_NUMBER("Hausnummer"),
  POSTAL_CODE("PLZ"),
  CITY("Ort"),
  ADDRESS_ADDITION("Adresszusatz"),
  DATE_OF_BIRTH("Geburtsdatum"),
  PLACE_OF_BIRTH("Geburtsort"),
  COUNTRY_OF_BIRTH(
      "Geburtsland (Länderkürzel nach ISO 3166-1, Bsp. Deutschland = DE, Türkei = TK, Syrien = SY)"),
  GENDER("Geschlecht (Männlich = M, Weiblich = W, Divers = D, Unbekannt = U)"),
  INFORMATION_BLOCK("Auskunftssperre (Ja = X)", Necessity.OPTIONAL),
  LAST_NAME_CUSTODIAN_1("Nachname PSB1"),
  FIRST_NAME_CUSTODIAN_1("Vorname PSB1"),
  STREET_CUSTODIAN_1("Straße PSB1"),
  HOUSE_NUMBER_CUSTODIAN_1("Hausnummer PSB1"),
  POSTAL_CODE_CUSTODIAN_1("PLZ PSB1"),
  CITY_CUSTODIAN_1("Ort PSB1"),
  ADDRESS_ADDITION_CUSTODIAN_1("Adresszusatz PSB1"),
  DATE_OF_BIRTH_CUSTODIAN_1("Geburtsdatum PSB1"),
  TITLE_CUSTODIAN_1("Titel PSB1"),
  SALUTATION_CUSTODIAN_1("Anrede (Herr, Frau, Neutral, Unbekannt) PSB1"),
  GENDER_CUSTODIAN_1("Geschlecht (Männlich = M, Weiblich = W, Divers = D, Unbekannt = U) PSB1"),
  LAST_NAME_CUSTODIAN_2("Nachname PSB2"),
  FIRST_NAME_CUSTODIAN_2("Vorname PSB2"),
  STREET_CUSTODIAN_2("Straße PSB2"),
  HOUSE_NUMBER_CUSTODIAN_2("Hausnummer PSB2"),
  POSTAL_CODE_CUSTODIAN_2("PLZ PSB2"),
  CITY_CUSTODIAN_2("Ort PSB2"),
  ADDRESS_ADDITION_CUSTODIAN_2("Adresszusatz PSB2"),
  DATE_OF_BIRTH_CUSTODIAN_2("Geburtsdatum PSB2"),
  TITLE_CUSTODIAN_2("Titel PSB2"),
  SALUTATION_CUSTODIAN_2("Anrede (Herr, Frau, Neutral, Unbekannt) PSB2"),
  GENDER_CUSTODIAN_2("Geschlecht (Männlich = M, Weiblich = W, Divers = D, Unbekannt = U) PSB2"),
  STATUS(STATUS_COLUMN_HEADER, Necessity.ADD_IF_MISSING, STATUS_COLUMN_HEADER_WIDTH),
  PROCEDURE_ID(PROCEDURE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH),
  REFERENCE_ID(REFERENCE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH);
  ;

  private final String header;
  private final Necessity necessity;
  private final int columnWidth;

  CitizenListColumn(String header, Necessity necessity, int columnWidth) {
    this.header = header;
    this.necessity = necessity;
    this.columnWidth = columnWidth;
  }

  CitizenListColumn(String header, Necessity necessity) {
    this(header, necessity, 0);
  }

  CitizenListColumn(String header) {
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
