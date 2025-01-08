/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.SchoolListColumn.*;

import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.business.model.ImportChildData;
import java.util.List;
import org.apache.poi.ss.usermodel.Sheet;

public class SchoolListRowReader extends RowReader<SchoolListRow, SchoolListColumn> {

  public SchoolListRowReader(Sheet sheet, List<SchoolListColumn> actualColumns) {
    super(sheet, actualColumns, SchoolListRow::new);
  }

  @Override
  protected void read(
      SchoolListRow result, ColumnAccessor<SchoolListColumn> col, ErrorHandler errorHandler) {
    result.setChild(readChildData(col, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setEntityId(readUuid(col, PROCEDURE_ID, errorHandler));
    result.setEntryLevel(readEntryLevelFlag(col, errorHandler));
    result.setEarlyExamination(readEarlyExaminationFlag(col, errorHandler));
  }

  private ImportChildData readChildData(
      ColumnAccessor<SchoolListColumn> col, ErrorHandler errorHandler) {
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

  private String readPhoneNumber(ColumnAccessor<SchoolListColumn> col, ErrorHandler errorHandler) {
    return cellAsString(col, PHONE_NUMBER, true, true, errorHandler);
  }

  private boolean readEntryLevelFlag(
      ColumnAccessor<SchoolListColumn> col, ErrorHandler errorHandler) {
    return cellAsFlag(col, ENTRY_LEVEL, errorHandler);
  }

  private boolean readEarlyExaminationFlag(
      ColumnAccessor<SchoolListColumn> col, ErrorHandler errorHandler) {
    return cellAsFlag(col, EARLY_EXAMINATION, errorHandler);
  }
}
