/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import static de.eshg.dental.importer.DentalColumn.DATE_OF_BIRTH;
import static de.eshg.dental.importer.DentalColumn.FIRST_NAME;
import static de.eshg.dental.importer.DentalColumn.GENDER;
import static de.eshg.dental.importer.DentalColumn.GROUP;
import static de.eshg.dental.importer.DentalColumn.LAST_NAME;

import de.eshg.dental.business.model.ImportChildData;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import java.util.List;
import org.apache.poi.ss.usermodel.Sheet;

public class DentalRowReader extends RowReader<DentalRowValues, DentalColumn> {

  public DentalRowReader(Sheet sheet, List<DentalColumn> actualColumns) {
    super(sheet, actualColumns);
  }

  @Override
  protected DentalRowValues read(ColumnAccessor<DentalColumn> col) {
    DentalRowValues result = new DentalRowValues();
    ErrorHandler errorHandler = createErrorHandler(result);

    ImportChildData child = readChild(col, errorHandler);
    result.setChild(child);

    return result;
  }

  private ImportChildData readChild(ColumnAccessor<DentalColumn> col, ErrorHandler errorHandler) {
    convertToTextCell(col, GROUP, errorHandler);

    return new ImportChildData(
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        cellAsString(col, GROUP, errorHandler));
  }
}
