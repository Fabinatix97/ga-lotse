/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static de.eshg.inspection.importer.FacilityDtoMatcher.isFacilityMatch;
import static de.eshg.lib.xlsximport.ImportStatus.BATCH_ERROR;
import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_WITHIN_LIST;
import static de.eshg.lib.xlsximport.ImportStatus.ERROR_INPUT_DATA;
import static de.eshg.lib.xlsximport.ImportStatus.EXCEPTION;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_PREVIOUSLY;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;
import static de.eshg.lib.xlsximport.ImportStatus.INVALID_PROCEDURE_ID;

import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.facility.SearchReferenceFacilitiesResponse;
import de.eshg.inspection.importer.ImportPersister.FacilityRef;
import de.eshg.inspection.importer.ImportPersister.FacilitySearchParams;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportStatus;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class InspectionImporter extends Importer<InspectionImporterRowValues, InspectionListColumn> {

  private static final Logger log = LoggerFactory.getLogger(InspectionImporter.class);

  private final ImportPersister importPersister;

  /** This map groups all rows having the same importId. */
  private final Map<String, List<InspectionImporterRowValues>> rowsWithImportIds =
      new LinkedHashMap<>();

  /**
   * This map groups all rows not having an importId, but having <i>exactly</i> the same facility
   * data. Note that if two rows have no importId, but have <i>almost</i> the same facility data,
   * but not <i>exactly</i> the same, then this will be treated as totally different facilities!
   * Currently, there is no similarity search!
   */
  private final Map<ImportInspectionFacility, List<InspectionImporterRowValues>>
      rowsWithoutImportIds = new LinkedHashMap<>();

  /**
   * This is a cache for base facility searches ({@code FacilityApi.searchReferenceFacilities()}).
   * It is kept during the run of one import process. It maps search query parameters to responses.
   */
  private final Map<FacilitySearchParams, SearchReferenceFacilitiesResponse>
      facilityDuplicateCandidates = new HashMap<>();

  private Long firstImportedInspectionId = null;

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
            markWithError(rowValues, INVALID_PROCEDURE_ID);
          }
        } else if (!rowValues.isValid()) {
          markWithError(rowValues, ERROR_INPUT_DATA);
        }
        // Note that we even add _invalid_ rows to the result maps.
        // This is intentional; in the next step createProceduresAndWriteResults() we'll
        // check if any batch of rows having the same (facility) importId has any error;
        // then we'll mark the _all_ rows of the same batch as error.
        if (rowValues.hasImportId()) {
          rowsWithImportIds
              .computeIfAbsent(rowValues.getFacility().importId(), _id -> new ArrayList<>())
              .add(rowValues);
        } else {
          rowsWithoutImportIds
              .computeIfAbsent(rowValues.getFacility(), _f -> new ArrayList<>())
              .add(rowValues);
        }
        // Add to importableRows() for duplicate check in containsMatchingRow()
        validRows.importableRows().add(rowValues);
      }
    }
  }

  @Override
  protected void createProceduresAndWriteResults() {
    searchFacilityDuplicateCandidates();
    handleRowsWithImportIds();
    handleRowsWithoutImportIds();
  }

  @Override
  protected void mergeProceduresAndWriteResults() {}

  private void searchFacilityDuplicateCandidates() {
    facilityDuplicateCandidates.clear();
    Set<FacilitySearchParams> set = collectUniqueFacilitySearchParams();
    importPersister.batchSearchForFacilityDuplicates(set, facilityDuplicateCandidates);
  }

  private Set<FacilitySearchParams> collectUniqueFacilitySearchParams() {
    Set<FacilitySearchParams> set = new HashSet<>();
    for (InspectionImporterRowValues rowValues : validRows.importableRows()) {
      if (!hasError(rowValues)) {
        String facilityName = rowValues.getFacility().facilityDetailsDto().name();
        set.add(new FacilitySearchParams(facilityName));
      }
    }
    return set;
  }

  /** Import rows in batches having the same facility importId. */
  private void handleRowsWithImportIds() {
    rowsWithImportIds.values().forEach(this::importBatch);
  }

  /** Import rows in batches having <i>exactly</i> the same facility data (but no importId). */
  private void handleRowsWithoutImportIds() {
    rowsWithoutImportIds.values().forEach(this::importBatch);
  }

  /** Import a batch of rows. The rows of the batch all belong to the same facility. */
  private void importBatch(List<InspectionImporterRowValues> batch) {
    // First of all sort the batch by ascending inspection date.
    batch.sort(Comparator.comparing(row -> row.getInspection().lastInspected()));

    // Try to import the facility first. Take the facility data of the _last_ row in this batch,
    // because the batch is sorted by ascending inspection date, and the last row contains the
    // _newest_ facility data. This will be the _reference_ facility. The other rows might contain
    // different facility data; these will be saved as different fileStates for the reference
    // facility. (PS: Note that if we're importing a batch from 'handleRowsWithoutImportIds', then
    // all rows will have exactly the same facility data, so it doesn't matter if we take the first
    // or last facility in this case.)
    InspectionImporterRowValues rowForFacility = batch.getLast();
    FacilityRef facilityRef;
    try {
      facilityRef = searchForDuplicatesAndAddFacility(rowForFacility.getFacility());
    } catch (Exception ex) {
      log.error("error importing row #{}", rowForFacility.getRow().getRowNum(), ex);
      markWithError(rowForFacility, EXCEPTION);
      // Since we could not add the facility, mark the other inspection rows of
      // the same batch as BATCH_ERROR, and proceed with next batch.
      batch.stream()
          .filter(rowValues -> rowValues != rowForFacility)
          .forEach(rowValues -> markWithError(rowValues, BATCH_ERROR));
      return;
    }

    // Try to import inspections for this facility. Also create a new facility fileState for each
    // row. If an error occurs, then the remaining rows of the batch are marked with BATCH_ERROR,
    // and are not imported.
    boolean batchHasError = false;
    for (int i = 0; i < batch.size(); i++) {
      checkOtherInspectionsAtTheSameDay(batch, i);
      InspectionImporterRowValues rowValues = batch.get(i);
      if (hasError(rowValues)) {
        // mark remaining rows of the same batch as BATCH_ERROR
        batchHasError = true;
        continue;
      }
      if (batchHasError) {
        markWithError(rowValues, BATCH_ERROR);
        continue;
      }
      try {
        importInspection(rowValues, facilityRef);
      } catch (Exception ex) {
        log.error("error importing row #{}", rowValues.getRow().getRowNum(), ex);
        markWithError(rowValues, EXCEPTION);
        batchHasError = true;
      }
    }
  }

  private void checkOtherInspectionsAtTheSameDay(
      List<InspectionImporterRowValues> batch, int current) {
    InspectionImporterRowValues rowValues = batch.get(current);
    ImportInspection importInspection = rowValues.getInspection();
    for (int i = 0; i < current; i++) {
      ImportInspection otherInspection = batch.get(i).getInspection();
      if (importInspection.isSameDayAndResultAs(otherInspection)) {
        addErrorForCell(
            InspectionListColumn.INSPECTED_AT,
            "Es gibt eine andere Zeile mit derselben Begehung zur selben Zeit",
            rowValues);
        markWithError(rowValues, DUPLICATE_WITHIN_LIST);
        return;
      } else if (importInspection.isSameDayDifferentResultAs(otherInspection)) {
        addErrorForCell(
            InspectionListColumn.INSPECTION_RESULT,
            "Anderes Ergebnis als andere Begehung zur selben Zeit",
            rowValues);
        markWithError(rowValues, ERROR_INPUT_DATA);
        return;
      }
    }
  }

  /**
   * Search in central file if we might have already an existing <i>base facility</i> for the given
   * {@code importFacility}. If we find an <i>exact</i> match then check if we already have an
   * <i>inspection facility</i> for that base facility; create one if not. Otherwise, create both a
   * new base facility and an inspection facility. Return the found/created inspection facility and
   * its base reference id.
   *
   * @param importFacility the facility to import
   * @return facility and base reference id.
   */
  private @NotNull FacilityRef searchForDuplicatesAndAddFacility(
      ImportInspectionFacility importFacility) {
    FacilityDetailsDto facilityDetails = importFacility.facilityDetailsDto();
    FacilitySearchParams search = new FacilitySearchParams(facilityDetails.name());
    SearchReferenceFacilitiesResponse response = facilityDuplicateCandidates.get(search);
    if (response == null || response.facilities().isEmpty()) {
      // No match at all. Create new base facility and inspection facility without marking it as
      // possible duplicate.
      return importPersister.addBaseFacilityAndInspectionFacility(importFacility, false);
    } else {
      Optional<GetReferenceFacilityResponse> exactMatch = findMatchFor(facilityDetails, response);
      if (exactMatch.isPresent()) {
        // Found exact match. But if there are other (similar) facilities in the response,
        // then mark the inspection-facility as possible duplicate.
        boolean hasPossibleDuplicates = response.facilities().size() > 1;
        // Add new _inspection_ facility only, without adding a new base facility,
        // but only if we don't have one already for that base reference id.
        // Otherwise, return the _existing_ inspection facility, and its reference id.
        return importPersister.addInspectionFacilityForReferenceFacilityIfMissing(
            exactMatch.get(), importFacility.objectType(), hasPossibleDuplicates);
      } else {
        // No exact match. Create new base facility _and_ inspection facility, and mark as possible
        // duplicate, because there are other possible matches (because the
        // search result was not empty).
        return importPersister.addBaseFacilityAndInspectionFacility(importFacility, true);
      }
    }
  }

  private void importInspection(InspectionImporterRowValues rowValues, FacilityRef facilityRef) {
    Inspection inspection =
        importPersister.addInspection(
            rowValues.getInspection(),
            rowValues.getFacility(),
            facilityRef,
            firstImportedInspectionId);

    UUID procedureId = inspection.getExternalId();
    writeStatusAndProcedureId(rowValues.getRow(), IMPORTED_SUCCESSFULLY, procedureId);
    rowValues.setStatus(IMPORTED_SUCCESSFULLY);
    rowValues.setProcedureId(procedureId);
    stats.countCreated();

    if (firstImportedInspectionId == null) {
      firstImportedInspectionId = inspection.getId();
    }
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

  private void markWithError(InspectionImporterRowValues rowValues, ImportStatus error) {
    writeStatus(rowValues.getRow(), error);
    rowValues.setStatus(error);
    if (error == DUPLICATE_WITHIN_LIST) {
      stats.countDuplicated();
    } else {
      stats.countFailed();
    }
  }

  private void addErrorForCell(
      InspectionListColumn col, String errorMessage, InspectionImporterRowValues rowValues) {
    Row row = rowValues.getRow();
    Cell cell = row.getCell(col.ordinal());
    rowReader.createErrorHandler(rowValues).handleError(cell, errorMessage);
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

  private static Optional<GetReferenceFacilityResponse> findMatchFor(
      FacilityDetailsDto candidate, SearchReferenceFacilitiesResponse response) {
    return response.facilities().stream()
        .filter(facility -> isFacilityMatch(facility, candidate))
        .findFirst();
  }
}
