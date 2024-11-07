/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportValidator;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.lib.xlsximport.XlsxNormalizer;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository;
import de.eshg.schoolentry.domain.repository.Icd10GroupRepository;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import java.io.IOException;
import java.time.Year;
import java.util.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.springframework.stereotype.Service;

@Service
public class ImportService {

  private final SchoolEntryService schoolEntryService;
  private final SchoolEntryProperties schoolEntryProperties;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;
  private final Icd10CodeRepository icd10CodeRepository;
  private final Icd10GroupRepository icd10GroupRepository;

  public ImportService(
      SchoolEntryService schoolEntryService,
      SchoolEntryProperties schoolEntryProperties,
      ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper,
      Icd10CodeRepository icd10CodeRepository,
      Icd10GroupRepository icd10GroupRepository) {
    this.schoolEntryService = schoolEntryService;
    this.schoolEntryProperties = schoolEntryProperties;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
    this.icd10CodeRepository = icd10CodeRepository;
    this.icd10GroupRepository = icd10GroupRepository;
  }

  public ImportResult processSheetAndPersistProcedures(
      Sheet sheet, ImportType importType, UUID schoolId, UUID locationId, Year schoolYear)
      throws IOException {

    try (XlsxNormalizer xlsxNormalizer = new XlsxNormalizer()) {
      XSSFSheet normalizedSheet = xlsxNormalizer.normalize(sheet);

      SchoolEntryImporter<? extends SchoolEntryRowValues, ? extends XlsxColumn, ?>
          schoolEntryImporter =
              switch (importType) {
                case CITIZEN_LIST -> {
                  List<CitizenListColumn> actualColumns =
                      ImportValidator.validateHeaderFormat(
                          CitizenListColumn.values(), normalizedSheet);
                  yield new CitizenOrSchoolListImporter<>(
                      normalizedSheet,
                      new CitizenListRowReader(normalizedSheet, actualColumns),
                      new FeedbackColumnAccessor(actualColumns),
                      importType,
                      new CitizenListRowValueMapper(),
                      schoolId,
                      locationId,
                      schoolYear,
                      schoolEntryService,
                      schoolEntryProperties);
                }
                case SCHOOL_LIST -> {
                  List<SchoolListColumn> actualColumns =
                      ImportValidator.validateHeaderFormat(
                          SchoolListColumn.values(), normalizedSheet);
                  yield new CitizenOrSchoolListImporter<>(
                      normalizedSheet,
                      new SchoolListRowReader(normalizedSheet, actualColumns),
                      new FeedbackColumnAccessor(actualColumns),
                      importType,
                      new SchoolListRowValueMapper(schoolYear, procedureTypeAssignmentHelper),
                      schoolId,
                      locationId,
                      schoolYear,
                      schoolEntryService,
                      schoolEntryProperties);
                }
                case PAST_PROCEDURE_LIST -> {
                  List<PastProcedureListColumn> actualColumns =
                      ImportValidator.validateHeaderFormat(
                          PastProcedureListColumn.values(), normalizedSheet);
                  yield new PastProcedureListImporter(
                      normalizedSheet,
                      new PastProcedureListRowReader(
                          normalizedSheet,
                          actualColumns,
                          icd10CodeRepository,
                          icd10GroupRepository),
                      new FeedbackColumnAccessor(actualColumns),
                      schoolId,
                      schoolYear,
                      schoolEntryService);
                }
              };

      return schoolEntryImporter.process();
    }
  }
}
