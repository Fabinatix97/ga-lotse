/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_WITHIN_LIST;
import static de.eshg.lib.xlsximport.ImportStatus.ERROR_INPUT_DATA;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_PREVIOUSLY;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;
import static de.eshg.lib.xlsximport.ImportStatus.INVALID_PROCEDURE_ID;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportStatus;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class SchoolEntryImporter<T extends SchoolEntryRowValues, C extends XlsxColumn, M>
    extends Importer<T, C> {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryImporter.class);
  protected final UUID schoolId;
  protected final Year schoolYear;
  protected final SchoolEntryService schoolEntryService;

  protected SchoolEntryImporter(
      XSSFSheet sheet,
      RowReader<T, C> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      UUID schoolId,
      Year schoolYear,
      SchoolEntryService schoolEntryService) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.schoolId = schoolId;
    this.schoolYear = schoolYear;
    this.schoolEntryService = schoolEntryService;
  }

  @Override
  protected void readRowsAndEvaluateActions() {
    Map<Row, T> rowValues = readRows();

    List<UUID> existingProcedureIds = fetchExistingProceduresIfNecessary(rowValues);

    Map<PersonKeyAttributes, List<M>> mergeCandidates =
        fetchMergeCandidates(getChildKeyAttributesOfValidRows(rowValues));

    for (Entry<Row, T> entry : rowValues.entrySet()) {
      evaluateActionForRow(entry.getKey(), entry.getValue(), existingProcedureIds, mergeCandidates);
    }
  }

  private List<UUID> fetchExistingProceduresIfNecessary(Map<Row, T> rowValues) {
    List<UUID> procedureIds =
        rowValues.values().stream()
            .map(SchoolEntryRowValues::getProcedureId)
            .filter(Objects::nonNull)
            .toList();
    return schoolEntryService.collectExistingProcedures(procedureIds);
  }

  private Set<PersonKeyAttributes> getChildKeyAttributesOfValidRows(Map<Row, T> rowValues) {
    return rowValues.values().stream()
        .filter(row -> row.getProcedureId() == null)
        .filter(SchoolEntryRowValues::isValid)
        .map(SchoolEntryRowValues::getChildKeyAttributes)
        .collect(StreamUtil.toLinkedHashSet());
  }

  protected abstract Map<PersonKeyAttributes, List<M>> fetchMergeCandidates(
      Set<PersonKeyAttributes> childKeyAttributes);

  private void evaluateActionForRow(
      Row row,
      T rowValues,
      List<UUID> existingProcedureIds,
      Map<PersonKeyAttributes, List<M>> mergeCandidates) {

    if (rowValues.getProcedureId() != null) {
      if (existingProcedureIds.contains(rowValues.getProcedureId())) {
        writeStatus(row, IMPORTED_PREVIOUSLY);
        stats.countPreviouslyImported();
      } else {
        writeStatus(row, INVALID_PROCEDURE_ID);
        stats.countFailed();
      }
    } else if (rowValues.getStatus() == DUPLICATE_WITHIN_LIST
        || containsMatchingRow(validRows, rowValues)) {
      writeStatus(row, DUPLICATE_WITHIN_LIST);
      stats.countDuplicated();
    } else if (rowValues.isValid()) {

      evaluateActionForValidRow(row, rowValues, mergeCandidates);

    } else {
      writeStatus(row, ERROR_INPUT_DATA);
      stats.countFailed();
    }
  }

  protected boolean containsMatchingRow(ValidRows<T> rows, T values) {
    return Stream.concat(rows.importableRows().stream(), rows.mergeableRows().stream())
        .anyMatch(row -> row.isDuplicateRow(values));
  }

  protected abstract void evaluateActionForValidRow(
      Row row, T value, Map<PersonKeyAttributes, List<M>> mergeCandidates);

  @Override
  protected void createProceduresAndWriteResults() {
    List<T> importableRows = validRows.importableRows();
    try {
      List<SchoolEntryProcedure> createdProcedures = createProcedures(importableRows);
      writeProcedureIdsInSheet(importableRows, createdProcedures, IMPORTED_SUCCESSFULLY);
    } catch (Exception e) {
      log.error("Failure during creating new procedures.", e);
      writeFailedStatusInSheet(importableRows);
      stats.correctCreatedToFailed(importableRows.size());
    }
  }

  protected abstract List<SchoolEntryProcedure> createProcedures(List<T> importableRows);

  protected void writeProcedureIdsInSheet(
      List<T> importableRows,
      List<SchoolEntryProcedure> createdProcedures,
      ImportStatus importStatus) {
    for (int i = 0; i < importableRows.size(); i++) {
      T rowValues = importableRows.get(i);
      SchoolEntryProcedure createdProcedure = createdProcedures.get(i);

      Row row = rowValues.getRow();
      writeStatusAndProcedureId(row, importStatus, createdProcedure.getExternalId());
    }
  }

  @Override
  protected void mergeProceduresAndWriteResults() {
    List<T> mergeableRows = validRows.mergeableRows();
    List<UUID> failedProcedureIds = mergeProceduresAndGetFailedProcedureIds(mergeableRows);
    writeMergedFailedStatusInSheet(mergeableRows, failedProcedureIds);
    stats.correctMergeToFailed(failedProcedureIds.size());
  }

  protected abstract List<UUID> mergeProceduresAndGetFailedProcedureIds(List<T> mergeableRows);
}
