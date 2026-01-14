/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_IN_ASSET;
import static de.eshg.lib.xlsximport.ImportStatus.MERGED_SUCCESSFULLY;

import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.Validator;
import de.eshg.schoolentry.business.model.ImportPastProcedureData;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Predicate;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class PastProcedureListImporter
    extends SchoolEntryImporter<
        PastProcedureListRow, PastProcedureListColumn, SchoolEntryProcedure> {

  private final PastProcedureListRowValueMapper rowValueMapper;
  private final List<UUID> mergeCandidatesToBeDeleted;
  private final Icd10Validation icd10Validation;

  public PastProcedureListImporter(
      XSSFSheet sheet,
      RowReader<PastProcedureListRow, PastProcedureListColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      UUID schoolId,
      Year schoolYear,
      ImportService importService,
      Validator validator) {
    super(sheet, rowReader, feedbackColumnAccessor, schoolId, schoolYear, importService);
    this.rowValueMapper = new PastProcedureListRowValueMapper();
    this.mergeCandidatesToBeDeleted = new ArrayList<>();
    this.icd10Validation = new Icd10Validation(validator, rowReader);
  }

  @Override
  protected boolean shouldSkipReadingRow(Row row) {
    if (row.getRowNum() == 0) {
      return true;
    }
    return row.getRowNum() == 1 && isDataFormatHintRow(row);
  }

  private boolean isDataFormatHintRow(Row row) {
    return isEmptyCell(row.getCell(0))
        && isEmptyCell(row.getCell(1))
        && nullSafeEquals(row.getCell(2), "TT.MM.JJJJ")
        && nullSafeEquals(row.getCell(3), "M; W; D")
        && isEmptyCell(row.getCell(4))
        && isEmptyCell(row.getCell(5));
  }

  private boolean isEmptyCell(Cell cell) {
    return cell == null || cell.getStringCellValue().isEmpty();
  }

  private boolean nullSafeEquals(Cell cell, String content) {
    return cell != null && cell.getStringCellValue().equals(content);
  }

  @Override
  protected void evaluateActionsForRows(List<PastProcedureListRow> rows) {
    icd10Validation.validateIcd10Codes(rows);
    super.evaluateActionsForRows(rows);
  }

  @Override
  protected void evaluateActionForValidRow(
      PastProcedureListRow row,
      Map<PersonKeyAttributes, List<SchoolEntryProcedure>> mergeCandidates) {
    List<SchoolEntryProcedure> candidates =
        mergeCandidates.getOrDefault(row.getChildKeyAttributes(), List.of());

    if (candidates.isEmpty()) {
      addToImportableRows(row);
      stats.countCreated();
    } else {
      Optional<SchoolEntryProcedure> firstNonDeletableCandidate =
          candidates.stream().filter(Predicate.not(SchoolEntryProcedure::isDeletable)).findFirst();

      if (firstNonDeletableCandidate.isEmpty()) {
        List<UUID> mergeCandidateIds =
            candidates.stream().map(SchoolEntryProcedure::getExternalId).toList();
        mergeCandidatesToBeDeleted.addAll(mergeCandidateIds);
        addToMergeableRows(row);
        writeStatusAndReferenceId(row, MERGED_SUCCESSFULLY, mergeCandidateIds.getFirst());
        stats.countMerged();
      } else {
        writeStatusAndReferenceId(
            row, DUPLICATE_IN_ASSET, firstNonDeletableCandidate.get().getExternalId());
        stats.countMergeFailed();
      }
    }
  }

  @Override
  protected List<SchoolEntryProcedure> createProcedures(List<PastProcedureListRow> importableRows) {
    List<ImportPastProcedureData> importData =
        importableRows.stream().map(rowValueMapper::mapValuesToImportData).toList();
    return importService.createProceduresFromDataImport(importData, schoolId, schoolYear);
  }

  @Override
  protected List<UUID> mergeProceduresAndGetFailedProcedureIds(
      List<PastProcedureListRow> mergeableRows) {
    if (!mergeCandidatesToBeDeleted.isEmpty()) {
      importService.deleteProcedures(mergeCandidatesToBeDeleted);
    }
    List<SchoolEntryProcedure> createdProcedures = createProcedures(mergeableRows);
    writeProcedureIdsInSheet(mergeableRows, createdProcedures, MERGED_SUCCESSFULLY);
    return List.of();
  }

  @Override
  protected Map<PersonKeyAttributes, List<SchoolEntryProcedure>> fetchMergeCandidates(
      Set<PersonKeyAttributes> childKeyAttributes) {
    return importService.searchForMergeCandidatesForPastProcedures(childKeyAttributes, schoolYear);
  }
}
