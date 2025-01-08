/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import static de.eshg.dental.importer.ChildColumn.CHILD_ID;
import static de.eshg.dental.importer.ChildColumn.DATE_OF_BIRTH;
import static de.eshg.dental.importer.ChildColumn.FIRST_NAME;
import static de.eshg.dental.importer.ChildColumn.GENDER;
import static de.eshg.dental.importer.ChildColumn.GROUP;
import static de.eshg.dental.importer.ChildColumn.LAST_NAME;
import static de.eshg.dental.importer.ChildColumn.STATUS;

import de.eshg.dental.business.model.ImportChildData;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import java.util.List;
import org.apache.poi.ss.usermodel.Sheet;

public class ChildRowReader extends RowReader<ChildRow, ChildColumn> {

  public ChildRowReader(Sheet sheet, List<ChildColumn> actualColumns) {
    super(sheet, actualColumns, ChildRow::new);
  }

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
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        cellAsString(col, GROUP, errorHandler));
  }
}
