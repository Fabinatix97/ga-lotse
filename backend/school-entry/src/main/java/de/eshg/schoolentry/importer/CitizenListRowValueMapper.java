/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;

public class CitizenListRowValueMapper implements RowValueMapper<CitizenListRow> {

  @Override
  public ImportProcedureData mapValuesToImportData(CitizenListRow values) {
    return new ImportProcedureData(
        PersonMapper.mapImportChildDataToCreatePersonDto(values.getChild()),
        values.getCustodians(),
        ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT,
        null,
        false,
        false,
        values.hasInformationBlock());
  }

  @Override
  public MergeProcedureData mapValuesToMergeData(CitizenListRow values) {
    return new MergeProcedureData(
        values.getEntityId(),
        values.getChild().placeOfBirth(),
        values.getChild().countryOfBirth(),
        values.getCustodians(),
        values.getChild().phoneNumber(),
        null,
        null);
  }
}
