/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.PastProcedureListColumn.ADDRESS_ADDITION;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.CITY;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.DATE_OF_BIRTH;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.EXAMINATION_DATE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.FIRST_NAME;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.GENDER;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.HOUSE_NUMBER;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.LAST_NAME;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.POSTAL_CODE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PROCEDURE_ID;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PROCEDURE_TYPE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.STATUS;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.STREET;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.business.model.ImportChildData;
import java.util.List;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class PastProcedureListRowReader
    extends RowReader<PastProcedureListRowValues, PastProcedureListColumn> {

  public PastProcedureListRowReader(Sheet sheet, List<PastProcedureListColumn> actualColumns) {
    super(sheet, actualColumns);
  }

  @Override
  protected PastProcedureListRowValues read(ColumnAccessor<PastProcedureListColumn> col) {
    PastProcedureListRowValues result = new PastProcedureListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(readChildData(col, errorHandler));
    result.setProcedureType(readProcedureType(col, errorHandler));
    result.setExaminationDate(cellAsDate(col, EXAMINATION_DATE, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setProcedureId(readProcedureId(col, PROCEDURE_ID, errorHandler));

    return result;
  }

  private ImportChildData readChildData(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        readAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            false),
        null);
  }

  private ProcedureType readProcedureType(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(PROCEDURE_TYPE);
    String string = cellAsString(cell, errorHandler);

    return switch (string) {
      case "Regel" -> ProcedureType.REGULAR_EXAMINATION;
      case "Kann" -> ProcedureType.CAN_CHILD;
      case "Eingangsstufe" -> ProcedureType.ENTRY_LEVEL;
      default -> {
        errorHandler.accept(cell, "Ungültiger Wert");
        yield null;
      }
    };
  }
}
