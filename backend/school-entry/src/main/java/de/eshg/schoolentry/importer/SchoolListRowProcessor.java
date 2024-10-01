/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.SchoolListRowProcessor.SchoolListFields.*;

import de.eshg.base.CountryCodeDto;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.AddressData;
import de.eshg.schoolentry.business.model.ImportChildData;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import java.time.Year;
import java.util.Objects;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class SchoolListRowProcessor extends RowProcessor<SchoolListRowValues> {

  enum SchoolListFields {
    LAST_NAME(0),
    FIRST_NAME(1),
    DATE_OF_BIRTH(2),
    GENDER(3),
    STREET(4),
    HOUSE_NUMBER(5),
    POSTAL_CODE(6),
    CITY(7),
    ADDRESS_ADDITION(8),
    PHONE_NUMBER(9),
    ENTRY_LEVEL(10),
    EARLY_EXAMINATION(11),
    STATUS(12),
    PROCEDURE_ID(13);

    final int column;

    SchoolListFields(int column) {
      this.column = column;
    }
  }

  private final Year schoolYear;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;

  public SchoolListRowProcessor(
      Sheet sheet, Year schoolYear, ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper) {
    super(sheet);
    this.schoolYear = schoolYear;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
  }

  @Override
  protected SchoolListRowValues process(ColumnAccessor col) {
    SchoolListRowValues result = new SchoolListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(processChildData(col, errorHandler));
    result.setStatus(processStatus(col.get(STATUS.column), errorHandler));
    result.setProcedureId(processProcedureId(col.get(PROCEDURE_ID.column), errorHandler));
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
        values.isEntryLevel(),
        values.isEarlyExamination());
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
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    return new ImportChildData(
        cellAsString(col.get(FIRST_NAME.column), errorHandler),
        cellAsString(col.get(LAST_NAME.column), errorHandler),
        cellAsDate(col.get(DATE_OF_BIRTH.column), errorHandler),
        cellAsGender(col.get(GENDER.column), errorHandler),
        processAddressData(col, errorHandler),
        processPhoneNumber(col, errorHandler));
  }

  private AddressData processAddressData(
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    return new AddressData(
        CountryCodeDto.DE,
        cellAsString(col.get(CITY.column), false, true, errorHandler),
        cellAsString(col.get(POSTAL_CODE.column), false, false, errorHandler),
        cellAsString(col.get(STREET.column), false, true, errorHandler),
        cellAsString(col.get(HOUSE_NUMBER.column), true, false, errorHandler),
        cellAsString(col.get(ADDRESS_ADDITION.column), true, false, errorHandler));
  }

  private String processPhoneNumber(ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    return cellAsString(col.get(PHONE_NUMBER.column), true, false, errorHandler);
  }

  private boolean processEntryLevel(ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    return cellAsFlag(col.get(ENTRY_LEVEL.column), errorHandler);
  }

  private boolean processEarlyExamination(
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    return cellAsFlag(col.get(EARLY_EXAMINATION.column), errorHandler);
  }
}
