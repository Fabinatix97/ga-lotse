/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.export;

import de.eshg.lib.xlsximport.XlsxColumn;
import java.util.function.Function;

enum FacilityListColumn implements XlsxColumn {
  NAME("Name", 9600, ExportedBannedFacility::name),
  DATE_OF_BANNING("Untersagungsdatum", 5500, ExportedBannedFacility::dateOfBanning),
  OBJECTTYPE("Objekttyp", 9600, ExportedBannedFacility::objectType),
  POSTALCODE("PLZ", 1600, ExportedBannedFacility::postalCode),
  CITY("Ort", 6000, ExportedBannedFacility::city),
  STREET("Straße", 6000, ExportedBannedFacility::street),
  HOUSENUMBER("Hausnummer", 3500, ExportedBannedFacility::houseNumber),
  PHONENUMBER("Telefon", 5000, ExportedBannedFacility::phoneNumber),
  EMAIL("E-Mail", 8500, ExportedBannedFacility::emailAddress),
  ;

  private final String header;
  private final int columnWidth;

  private final Function<ExportedBannedFacility, ?> valueGetter;

  FacilityListColumn(
      String header, int columnWidth, Function<ExportedBannedFacility, ?> valueGetter) {
    this.header = header;
    this.columnWidth = columnWidth;
    this.valueGetter = valueGetter;
  }

  @Override
  public String getHeader() {
    return header;
  }

  @Override
  public Necessity getNecessity() {
    return Necessity.REQUIRED;
  }

  @Override
  public int getColumnWidth() {
    return columnWidth;
  }

  public Object getValue(ExportedBannedFacility facility) {
    return valueGetter.apply(facility);
  }
}
