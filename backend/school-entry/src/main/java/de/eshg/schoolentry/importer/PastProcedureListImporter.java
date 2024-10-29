/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.business.model.ImportPastProcedureData;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class PastProcedureListImporter
    extends SchoolEntryImporter<PastProcedureListRowValues, PastProcedureListColumn> {

  private final PastProcedureListRowValueMapper rowValueMapper;

  public PastProcedureListImporter(
      XSSFSheet sheet,
      RowReader<PastProcedureListRowValues, PastProcedureListColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      ImportType importType,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      SchoolEntryService schoolEntryService,
      SchoolEntryProperties schoolEntryProperties) {
    super(
        sheet,
        rowReader,
        feedbackColumnAccessor,
        importType,
        schoolId,
        locationId,
        schoolYear,
        schoolEntryService,
        schoolEntryProperties);
    this.rowValueMapper = new PastProcedureListRowValueMapper();
  }

  @Override
  protected List<SchoolEntryProcedure> createProcedures(
      List<PastProcedureListRowValues> importableRows) {

    List<ImportPastProcedureData> importData =
        importableRows.stream().map(rowValueMapper::mapValuesToImportData).toList();
    return schoolEntryService.createProceduresFromDataImport(
        importData, schoolId, locationId, schoolYear);
  }

  @Override
  protected List<UUID> mergeProceduresAndGetFailedProcedureIds(
      List<PastProcedureListRowValues> mergeableRows) {
    throw new UnsupportedOperationException(
        "Merge is not yet supported for past procedure list import.");
  }
}
