/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static de.eshg.lib.xlsximport.ImportStatus.BATCH_ERROR;
import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_WITHIN_LIST;
import static de.eshg.lib.xlsximport.ImportStatus.ERROR_INPUT_DATA;
import static de.eshg.lib.xlsximport.ImportStatus.EXCEPTION;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_PREVIOUSLY;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;
import static de.eshg.lib.xlsximport.ImportStatus.INVALID_PROCEDURE_ID;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsLast;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class InspectionImporter extends Importer<InspectionImporterRowValues, InspectionListColumn> {

  private static final Logger log = LoggerFactory.getLogger(InspectionImporter.class);

  private final ImportPersister importPersister;

  /**
   * This map groups all rows having the same importId. It maps to a TreeSet which is sorted by the
   * lastInspected column.
   */
  private final Map<String, TreeSet<InspectionImporterRowValues>> rowsWithImportIds =
      new LinkedHashMap<>();

  /**
   * This map groups all rows not having an importId, but having <i>exactly</i> the same facility
   * data. Each facility maps to a TreeSet which is sorted by the lastInspected column. Note that if
   * two rows have no importId, but have <i>almost</i> the same facility data, but not
   * <i>exactly</i> the same, then this will be treated as totally different facilities! Currently,
   * there is no similarity search!
   */
  private final Map<ImportInspectionFacility, TreeSet<InspectionImporterRowValues>>
      rowsWithoutImportIds = new LinkedHashMap<>();

  InspectionImporter(
      XSSFSheet sheet,
      RowReader<InspectionImporterRowValues, InspectionListColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      ImportPersister importPersister) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.importPersister = importPersister;
  }

  @Override
  protected void readRowsAndEvaluateActions() {
    Collection<InspectionImporterRowValues> values = readRows().values();
    Set<UUID> existingProcedureIds = fetchExistingProcedureIds(values);

    for (InspectionImporterRowValues rowValues : values) {
      Row row = rowValues.getRow();
      if (rowValues.getStatus() == DUPLICATE_WITHIN_LIST || containsMatchingRow(rowValues)) {
        writeStatus(row, DUPLICATE_WITHIN_LIST);
        rowValues.setStatus(DUPLICATE_WITHIN_LIST);
        stats.countDuplicated();
      } else {
        if (rowValues.getProcedureId() != null) {
          if (existingProcedureIds.contains(rowValues.getProcedureId())) {
            writeStatus(row, IMPORTED_PREVIOUSLY);
            rowValues.setStatus(IMPORTED_PREVIOUSLY);
            stats.countPreviouslyImported();
          } else {
            writeStatus(row, INVALID_PROCEDURE_ID);
            rowValues.setStatus(INVALID_PROCEDURE_ID);
            stats.countFailed();
          }
        } else if (!rowValues.isValid()) {
          writeStatus(row, ERROR_INPUT_DATA);
          rowValues.setStatus(ERROR_INPUT_DATA);
          stats.countFailed();
        }
        // Note that we even add _invalid_ rows to the result maps.
        // This is intentional; in the next step createProceduresAndWriteResults() we'll
        // check if any batch of rows having the same (facility) importId has any error;
        // then we'll mark the _all_ rows of the same batch as error.
        if (rowValues.hasImportId()) {
          rowsWithImportIds
              .computeIfAbsent(
                  rowValues.getFacility().importId(), _id -> createSetSortedByLastInspected())
              .add(rowValues);
        } else {
          rowsWithoutImportIds
              .computeIfAbsent(rowValues.getFacility(), _f -> createSetSortedByLastInspected())
              .add(rowValues);
        }
        // Add to importableRows() for duplicate check in containsMatchingRow()
        validRows.importableRows().add(rowValues);
      }
    }

    // Clear validRows() list to save memory. We don't need it in the following steps.
    validRows.importableRows().clear();
  }

  @Override
  protected void createProceduresAndWriteResults() {
    handleRowsWithImportIds();
    handleRowsWithoutImportIds();
  }

  @Override
  protected void mergeProceduresAndWriteResults() {}

  private void handleRowsWithImportIds() {
    rowsWithImportIds.values().forEach(this::importBatchWithSameImportId);
  }

  private void handleRowsWithoutImportIds() {
    rowsWithoutImportIds.forEach(this::importBatchWithExactlySameFacility);
  }

  /**
   * Import a batch of rows having the same facility importId. The rows in the batch are sorted by
   * "begangen am" (lastInspected) date.
   */
  private void importBatchWithSameImportId(TreeSet<InspectionImporterRowValues> batch) {
    boolean batchHasError = false;
    UUID facilityReferenceId = null;
    Facility facility = null;

    for (InspectionImporterRowValues rowValues : batch) {
      if (hasError(rowValues)) {
        // mark remaining rows of the same batch as BATCH_ERROR
        batchHasError = true;
      } else if (batchHasError) {
        markAsBatchError(rowValues);
      } else {
        ImportInspectionFacility importFacility = rowValues.getFacility();
        try {
          UUID centralFileStateId =
              importPersister.addBaseFacility(importFacility, facilityReferenceId);
          if (facilityReferenceId == null) {
            // ensure that the subsequent facility file states get the same referenceId
            facilityReferenceId = importPersister.getReferenceFacilityId(centralFileStateId);
            // add an inspection facility for the first file state,
            // re-use this inspection facility for the subsequent inspections
            facility = importPersister.addInspectionFacility(importFacility, centralFileStateId);
          }
          importInspection(rowValues, facility, centralFileStateId);
        } catch (Exception ex) {
          log.error("error importing row #{}", rowValues.getRow().getRowNum(), ex);
          markWithException(rowValues);
          batchHasError = true;
        }
      }
    }
  }

  /**
   * Import a batch of rows having exactly the same facility data (but no importId). The rows in the
   * batch are sorted by "begangen am" (lastInspected) date.
   */
  private void importBatchWithExactlySameFacility(
      ImportInspectionFacility importFacility, TreeSet<InspectionImporterRowValues> batch) {
    Facility facility;
    UUID facilityReferenceId;
    // try to import facility
    try {
      UUID centralFileStateId = importPersister.addBaseFacility(importFacility, null);
      facility = importPersister.addInspectionFacility(importFacility, centralFileStateId);
      facilityReferenceId = importPersister.getReferenceFacilityId(centralFileStateId);
    } catch (Exception ex) {
      log.error("error importing row #{}", batch.first().getRow().getRowNum(), ex);
      markWithException(batch.first());
      // since we could not add the facility, mark the remaining inspection rows
      // of the same batch as BATCH_ERROR
      for (InspectionImporterRowValues rowValues : batch.tailSet(batch.first(), false)) {
        markAsBatchError(rowValues);
      }
      return;
    }

    // try to import inspections for this facility
    boolean batchHasError = false;
    for (InspectionImporterRowValues rowValues : batch) {
      if (hasError(rowValues)) {
        // mark remaining rows of the same batch as BATCH_ERROR
        batchHasError = true;
      } else if (batchHasError) {
        markAsBatchError(rowValues);
      } else {
        try {
          UUID centralFileStateId =
              importPersister.addBaseFacility(importFacility, facilityReferenceId);
          importInspection(rowValues, facility, centralFileStateId);
        } catch (Exception ex) {
          log.error("error importing row #{}", rowValues.getRow().getRowNum(), ex);
          markWithException(rowValues);
          batchHasError = true;
        }
      }
    }
  }

  private void importInspection(
      InspectionImporterRowValues rowValues, Facility facility, UUID centralFileStateId) {
    ImportInspection importInspection = rowValues.getInspection();
    String facilityName = rowValues.getFacility().facilityDetailsDto().name();
    Inspection inspection =
        importPersister.addInspection(importInspection, facilityName, facility, centralFileStateId);
    UUID procedureId = inspection.getExternalId();
    writeStatusAndProcedureId(rowValues.getRow(), IMPORTED_SUCCESSFULLY, procedureId);
    rowValues.setStatus(IMPORTED_SUCCESSFULLY);
    rowValues.setProcedureId(procedureId);
    stats.countCreated();
  }

  private Set<UUID> fetchExistingProcedureIds(Collection<InspectionImporterRowValues> values) {
    List<UUID> procedureIds =
        values.stream()
            .map(InspectionImporterRowValues::getProcedureId)
            .filter(Objects::nonNull)
            .toList();
    return importPersister.fetchExistingProcedureIds(procedureIds);
  }

  private boolean containsMatchingRow(InspectionImporterRowValues rowValues) {
    return validRows.importableRows().stream().anyMatch(row -> row.isDuplicateRow(rowValues));
  }

  private static boolean hasError(InspectionImporterRowValues rowValues) {
    if (!rowValues.isValid()) return true;
    return switch (rowValues.getStatus()) {
      case null -> false;
      case ERROR_INPUT_DATA,
              INVALID_PROCEDURE_ID,
              IMPORTED_PREVIOUSLY,
              DUPLICATE_WITHIN_LIST,
              DUPLICATE_IN_ASSET,
              EXCEPTION,
              BATCH_ERROR,
              MERGE_FAILED ->
          true;
      case IMPORTED_SUCCESSFULLY, MERGED_SUCCESSFULLY -> false;
    };
  }

  private void markAsBatchError(InspectionImporterRowValues rowValues) {
    writeStatus(rowValues.getRow(), BATCH_ERROR);
    rowValues.setStatus(BATCH_ERROR);
    stats.countFailed();
  }

  private void markWithException(InspectionImporterRowValues rowValues) {
    writeStatus(rowValues.getRow(), EXCEPTION);
    rowValues.setStatus(EXCEPTION);
    stats.countFailed();
  }

  private static TreeSet<InspectionImporterRowValues> createSetSortedByLastInspected() {
    return new TreeSet<>(
        Comparator.comparing(
            key -> key.getInspection().lastInspected(), nullsLast(naturalOrder())));
  }
}
