/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.SchoolListColumn.*;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.ImportChildData;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import java.time.Year;
import java.util.List;
import java.util.Objects;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class SchoolListRowProcessor extends RowProcessor<SchoolListRowValues, SchoolListColumn> {

  private final Year schoolYear;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;

  public SchoolListRowProcessor(
      Sheet sheet,
      List<SchoolListColumn> actualColumns,
      Year schoolYear,
      ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper) {
    super(sheet, actualColumns);
    this.schoolYear = schoolYear;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
  }

  @Override
  protected SchoolListRowValues process(ColumnAccessor<SchoolListColumn> col) {
    SchoolListRowValues result = new SchoolListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(processChildData(col, errorHandler));
    result.setStatus(processStatus(col, STATUS, errorHandler));
    result.setProcedureId(processProcedureId(col, PROCEDURE_ID, errorHandler));
    result.setEntryLevel(processEntryLevel(col, errorHandler));
    result.setEarlyExamination(processEarlyExamination(col, errorHandler));

    return result;
  }

  @Override
  public boolean equalRowValues(SchoolListRowValues values1, SchoolListRowValues values2) {
    return Objects.equals(values1.getChild(), values2.getChild());
  }

  @Override
  public ImportProcedureData mapValuesToImportData(SchoolListRowValues values) {
    ProcedureType procedureType =
        procedureTypeAssignmentHelper.getProcedureTypeForSchoolListImport(
            values.isEntryLevel(), values.getChild().dateOfBirth(), schoolYear);
    return new ImportProcedureData(
        PersonMapper.mapImportChildDataToCreatePersonDto(values.getChild()),
        procedureType,
        null,
        values.isEntryLevel(),
        values.isEarlyExamination(),
        false);
  }

  @Override
  public MergeProcedureData mapValuesToMergeData(SchoolListRowValues values) {
    return new MergeProcedureData(
        values.getProcedureId(),
        null,
        null,
        null,
        values.getChild().phoneNumber(),
        values.isEntryLevel(),
        values.isEarlyExamination());
  }

  private ImportChildData processChildData(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        processAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            true),
        processPhoneNumber(col, errorHandler));
  }

  private String processPhoneNumber(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return cellAsString(col, PHONE_NUMBER, true, true, errorHandler);
  }

  private boolean processEntryLevel(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return cellAsFlag(col, ENTRY_LEVEL, errorHandler);
  }

  private boolean processEarlyExamination(
      ColumnAccessor<SchoolListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return cellAsFlag(col, EARLY_EXAMINATION, errorHandler);
  }
}
