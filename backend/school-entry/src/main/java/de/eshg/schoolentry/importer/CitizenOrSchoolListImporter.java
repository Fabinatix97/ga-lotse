/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.business.model.DataOrigin;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class CitizenOrSchoolListImporter<T extends SchoolEntryRowValues, C extends XlsxColumn>
    extends SchoolEntryImporter<T, C> {

  private final RowValueMapper<T> rowValueMapper;

  public CitizenOrSchoolListImporter(
      XSSFSheet sheet,
      RowReader<T, C> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      ImportType importType,
      RowValueMapper<T> rowValueMapper,
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
    this.rowValueMapper = rowValueMapper;
  }

  @Override
  protected List<SchoolEntryProcedure> createProcedures(List<T> importableRows) {
    List<ImportProcedureData> importData =
        importableRows.stream().map(rowValueMapper::mapValuesToImportData).toList();
    return schoolEntryService.createProceduresWithBookAppointmentTask(
        importData, schoolId, locationId, schoolYear, DataOrigin.DATA_IMPORT);
  }

  @Override
  protected List<UUID> mergeProceduresAndGetFailedProcedureIds(List<T> mergeableRows) {
    List<MergeProcedureData> mergeData =
        mergeableRows.stream().map(rowValueMapper::mapValuesToMergeData).toList();
    return schoolEntryService.mergeProcedures(
        mergeData, importType, schoolId, locationId, schoolYear);
  }
}
