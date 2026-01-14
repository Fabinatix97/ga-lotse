/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import java.time.Year;
import java.util.List;

public class SchoolListRowValueMapper implements RowValueMapper<SchoolListRow> {

  private final Year schoolYear;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;

  public SchoolListRowValueMapper(
      Year schoolYear, ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper) {
    this.schoolYear = schoolYear;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
  }

  @Override
  public ImportProcedureData mapValuesToImportData(SchoolListRow values) {
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
  public MergeProcedureData mapValuesToMergeData(SchoolListRow values) {
    return new MergeProcedureData(
        values.getEntityId(),
        null,
        null,
        List.of(),
        List.of(),
        values.getChild().phoneNumber(),
        values.getChild().email(),
        values.isEntryLevel(),
        values.isEarlyExamination());
  }
}
