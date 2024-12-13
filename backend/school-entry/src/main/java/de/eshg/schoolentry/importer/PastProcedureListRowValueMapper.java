/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.business.model.ImportPastProcedureData;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;

public class PastProcedureListRowValueMapper {

  public ImportPastProcedureData mapValuesToImportData(PastProcedureListRow values) {
    return new ImportPastProcedureData(
        new ImportProcedureData(
            PersonMapper.mapImportChildDataToCreatePersonDto(values.getChild()),
            values.getProcedureType(),
            values.getExaminationDate(),
            false,
            false,
            false),
        values.getAnamnesis(),
        values.getVaccinationStatus(),
        values.getEyeExaminationResult(),
        values.getHearingTest(),
        values.getSopessExamination(),
        values.getDevelopmentScreening());
  }
}
