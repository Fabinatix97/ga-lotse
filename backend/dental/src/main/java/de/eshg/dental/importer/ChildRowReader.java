/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_FIRST_NAME_LENGTH;
import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_LAST_NAME_LENGTH;
import static de.eshg.dental.importer.ChildColumn.ADDRESS_ADDITION;
import static de.eshg.dental.importer.ChildColumn.CHILD_ID;
import static de.eshg.dental.importer.ChildColumn.CITY;
import static de.eshg.dental.importer.ChildColumn.DATE_OF_BIRTH;
import static de.eshg.dental.importer.ChildColumn.FIRST_NAME;
import static de.eshg.dental.importer.ChildColumn.GENDER;
import static de.eshg.dental.importer.ChildColumn.GROUP;
import static de.eshg.dental.importer.ChildColumn.HOUSE_NUMBER;
import static de.eshg.dental.importer.ChildColumn.LAST_NAME;
import static de.eshg.dental.importer.ChildColumn.POSTAL_CODE;
import static de.eshg.dental.importer.ChildColumn.STATUS;
import static de.eshg.dental.importer.ChildColumn.STREET;

import de.eshg.dental.business.model.ImportChildData;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import java.time.Clock;
import java.util.List;
import java.util.Locale;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.context.i18n.LocaleContextHolder;

public class ChildRowReader extends RowReader<ChildRow, ChildColumn> {
  boolean isGroupNameOptional;

  public ChildRowReader(
      Sheet sheet, Clock clock, List<ChildColumn> actualColumns, boolean isGroupNameOptional) {
    super(sheet, actualColumns, ChildRow::new, clock);
    this.isGroupNameOptional = isGroupNameOptional;
  }

  private static final AddressColumns<ChildColumn> CHILD_ADDRESS_COLUMNS =
      new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION);

  @Override
  protected void read(ChildRow result, ColumnAccessor<ChildColumn> col, ErrorHandler errorHandler) {
    ImportChildData child = readChild(col, errorHandler);
    result.setChild(child);
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setEntityId(readUuid(col, CHILD_ID, errorHandler));
  }

  private ImportChildData readChild(ColumnAccessor<ChildColumn> col, ErrorHandler errorHandler) {
    convertToTextCell(col, GROUP, errorHandler);
    LocaleContextHolder.setLocale(Locale.GERMAN);
    try {
      return new ImportChildData(
          cellAsString(col, LAST_NAME, MAX_LAST_NAME_LENGTH, errorHandler),
          cellAsString(col, FIRST_NAME, MAX_FIRST_NAME_LENGTH, errorHandler),
          cellAsDateOfBirth(col, DATE_OF_BIRTH, false, errorHandler),
          cellAsGender(col, GENDER, errorHandler),
          cellAsString(col, GROUP, isGroupNameOptional, false, errorHandler),
          readAddressData(col, CHILD_ADDRESS_COLUMNS, errorHandler, false));
    } finally {
      LocaleContextHolder.resetLocaleContext();
    }
  }
}
