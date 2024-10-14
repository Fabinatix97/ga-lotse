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
import de.eshg.schoolentry.business.model.ImportChildData;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ExceptionUtil;
import java.util.List;
import java.util.Objects;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class PastProcedureListRowProcessor
    extends RowProcessor<PastProcedureListRowValues, PastProcedureListColumn> {

  public PastProcedureListRowProcessor(Sheet sheet, List<PastProcedureListColumn> actualColumns) {
    super(sheet, actualColumns);
  }

  @Override
  protected PastProcedureListRowValues process(ColumnAccessor<PastProcedureListColumn> col) {
    PastProcedureListRowValues result = new PastProcedureListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(processChildData(col, errorHandler));
    result.setProcedureType(processProcedureType(col, errorHandler));
    result.setExaminationDate(cellAsDate(col, EXAMINATION_DATE, errorHandler));
    result.setStatus(processStatus(col, STATUS, errorHandler));
    result.setProcedureId(processProcedureId(col, PROCEDURE_ID, errorHandler));

    return result;
  }

  private ImportChildData processChildData(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        processAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            false),
        null);
  }

  private ProcedureType processProcedureType(
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

  @Override
  public boolean equalRowValues(
      PastProcedureListRowValues values1, PastProcedureListRowValues values2) {
    return Objects.equals(values1.getChild(), values2.getChild());
  }

  @Override
  public ImportProcedureData mapValuesToImportData(PastProcedureListRowValues values) {
    return new ImportProcedureData(
        PersonMapper.mapImportChildDataToCreatePersonDto(values.getChild()),
        values.getProcedureType(),
        values.getExaminationDate(),
        false,
        false,
        false);
  }

  @Override
  public MergeProcedureData mapValuesToMergeData(PastProcedureListRowValues values) {
    throw ExceptionUtil.mergeNotSupportedForPastProcedureImport();
  }
}
