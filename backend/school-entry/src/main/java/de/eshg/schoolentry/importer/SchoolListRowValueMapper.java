/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import java.time.Year;

public class SchoolListRowValueMapper implements RowValueMapper<SchoolListRowValues> {

  private final Year schoolYear;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;

  public SchoolListRowValueMapper(
      Year schoolYear, ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper) {
    this.schoolYear = schoolYear;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
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
}
