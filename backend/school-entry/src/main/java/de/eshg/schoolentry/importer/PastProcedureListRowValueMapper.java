/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ExceptionUtil;

public class PastProcedureListRowValueMapper implements RowValueMapper<PastProcedureListRowValues> {

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
