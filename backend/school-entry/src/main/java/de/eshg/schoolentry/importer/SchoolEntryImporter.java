/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportStatus;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class SchoolEntryImporter<R extends SchoolEntryRow<R>, C extends XlsxColumn, M>
    extends Importer<R, C> {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryImporter.class);
  protected final UUID schoolId;
  protected final Year schoolYear;
  protected final ImportService importService;

  protected SchoolEntryImporter(
      XSSFSheet sheet,
      RowReader<R, C> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      UUID schoolId,
      Year schoolYear,
      ImportService importService) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.schoolId = schoolId;
    this.schoolYear = schoolYear;
    this.importService = importService;
  }

  @Override
  protected void evaluateActionsForRows(List<R> rows) {
    List<UUID> existingProcedureIds = fetchExistingProceduresIfNecessary(rows);

    Map<PersonKeyAttributes, List<M>> mergeCandidates =
        fetchMergeCandidates(getChildKeyAttributesOfValidRows(rows));

    for (R row : rows) {
      evaluateActionForRow(row, existingProcedureIds, mergeCandidates);
    }
  }

  private List<UUID> fetchExistingProceduresIfNecessary(List<R> rows) {
    List<UUID> procedureIds =
        rows.stream().map(SchoolEntryRow::getEntityId).filter(Objects::nonNull).toList();
    return importService.collectExistingProcedures(procedureIds);
  }

  private Set<PersonKeyAttributes> getChildKeyAttributesOfValidRows(List<R> rows) {
    return rows.stream()
        .filter(row -> row.getEntityId() == null)
        .filter(SchoolEntryRow::isValid)
        .map(SchoolEntryRow::getChildKeyAttributes)
        .collect(StreamUtil.toLinkedHashSet());
  }

  protected abstract Map<PersonKeyAttributes, List<M>> fetchMergeCandidates(
      Set<PersonKeyAttributes> childKeyAttributes);

  private void evaluateActionForRow(
      R row, List<UUID> existingProcedureIds, Map<PersonKeyAttributes, List<M>> mergeCandidates) {
    if (row.getEntityId() != null) {
      if (existingProcedureIds.contains(row.getEntityId())) {
        markAsImportedPreviously(row);
      } else {
        markAsInvalidEntityId(row);
      }
    } else if (isDuplicateRow(row)) {
      markAsDuplicateWithinList(row);
    } else if (row.isValid()) {
      evaluateActionForValidRow(row, mergeCandidates);
    } else {
      markAsInputDataError(row);
    }
  }

  protected abstract void evaluateActionForValidRow(
      R row, Map<PersonKeyAttributes, List<M>> mergeCandidates);

  @Override
  protected void createEntitiesAndWriteResults(List<R> importableRows) {
    try {
      List<SchoolEntryProcedure> createdProcedures = createProcedures(importableRows);
      writeProcedureIdsInSheet(importableRows, createdProcedures, IMPORTED_SUCCESSFULLY);
    } catch (Exception e) {
      log.error("Failure during creating new procedures.", e);
      writeFailedStatusInSheet(importableRows);
      stats.correctCreatedToFailed(importableRows.size());
    }
  }

  protected abstract List<SchoolEntryProcedure> createProcedures(List<R> importableRows);

  protected void writeProcedureIdsInSheet(
      List<R> importableRows,
      List<SchoolEntryProcedure> createdProcedures,
      ImportStatus importStatus) {
    for (int i = 0; i < importableRows.size(); i++) {
      R row = importableRows.get(i);
      SchoolEntryProcedure createdProcedure = createdProcedures.get(i);
      writeStatusAndEntityId(row, importStatus, createdProcedure.getExternalId());
    }
  }

  @Override
  protected void mergeEntitiesAndWriteResults(List<R> mergeableRows) {
    List<UUID> failedProcedureIds = mergeProceduresAndGetFailedProcedureIds(mergeableRows);
    writeMergedFailedStatusInSheet(mergeableRows, failedProcedureIds);
    stats.correctMergeToFailed(failedProcedureIds.size());
  }

  protected abstract List<UUID> mergeProceduresAndGetFailedProcedureIds(List<R> mergeableRows);
}
