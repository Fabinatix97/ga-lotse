/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import static de.eshg.dental.importer.ChildColumn.*;

import de.eshg.dental.business.model.ImportChildData;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import java.time.Clock;
import java.util.List;
import org.apache.poi.ss.usermodel.Sheet;

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

    return new ImportChildData(
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsDateOfBirth(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        cellAsString(col, GROUP, isGroupNameOptional, false, errorHandler),
        readAddressData(col, CHILD_ADDRESS_COLUMNS, errorHandler, false));
  }
}
