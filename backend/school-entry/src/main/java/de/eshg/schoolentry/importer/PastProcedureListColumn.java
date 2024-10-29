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
  SIBLINGS("KIH"),
  NATIONALITY_CHILD("STAKI"),
  COUNTRY_OF_BIRTH_P1("GEBET1"),
  NATIONALITY_P1("STAET1"),
  COUNTRY_OF_BIRTH_P2("GEBET2"),
  NATIONALITY_P2("STAET2"),
  MIGRATION_BACKGROUND("MIG"),
  DAYCARE("KT"),
  PRELIMINARY_COURSE("VLK"),
  BIRTH_WEIGHT("GG"),
  INTEGRATION_PLACE("IP"),
  EARLY_SUPPORT("FF"),
  ERGO_THERAPY("ERGO"),
  SPEECH_THERAPY("LOGO"),
  PHYSIO_THERAPY("KG"),
  CHILD_LANGUAGE_SCREENING("KISS"),
  U2("U2E"),
  U3("U3E"),
  U4("U4E"),
  U5("U5E"),
  U6("U6E"),
  U7("U7E"),
  U7A("U7A"),
  U8("U8E"),
  U9("U9E"),
  VACCINATION_SCHEME("Impfschema"),
  TETANUS("Tet"),
  DIPHTERIA("Dip"),
  PERTUSSIS("Per"),
  POLIO("Pol"),
  HIB("HIB"),
  HEPATITIS_B("HBV"),
  MMR("MMR"),
  VARICELLA("Vari"),
  MENINGOCOCCUS_C("MenC"),
  PNEUMOCOCCUS("Pneumo"),
  HEPATITIS_A("HAV"),
  TBE("FSME"),
  ROTA("Rota"),
  MENINGOCOCCUS_B("MenB"),
  PERKOMBI_HBV("PerkombiHBV"),
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
