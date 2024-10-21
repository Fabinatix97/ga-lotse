/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.SchoolListColumn.*;

import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.business.model.ImportChildData;
import java.util.List;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class SchoolListRowReader extends RowReader<SchoolListRowValues, SchoolListColumn> {

  public SchoolListRowReader(Sheet sheet, List<SchoolListColumn> actualColumns) {
    super(sheet, actualColumns);
  }

  @Override
  protected SchoolListRowValues read(ColumnAccessor<SchoolListColumn> col) {
    SchoolListRowValues result = new SchoolListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(readChildData(col, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setProcedureId(readProcedureId(col, PROCEDURE_ID, errorHandler));
    result.setEntryLevel(readEntryLevelFlag(col, errorHandler));
    result.setEarlyExamination(readEarlyExaminationFlag(col, errorHandler));

    return result;
  }

  private ImportChildData readChildData(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        readAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            true),
        readPhoneNumber(col, errorHandler));
  }

  private String readPhoneNumber(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return cellAsString(col, PHONE_NUMBER, true, true, errorHandler);
  }

  private boolean readEntryLevelFlag(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return cellAsFlag(col, ENTRY_LEVEL, errorHandler);
  }

  private boolean readEarlyExaminationFlag(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return cellAsFlag(col, EARLY_EXAMINATION, errorHandler);
  }
}
