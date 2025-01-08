/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
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
import static de.eshg.lib.xlsximport.ImportStatus.INVALID_ENTITY_ID;

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
import java.util.ArrayList;
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
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class InspectionImporter extends Importer<InspectionImporterRow, InspectionListColumn> {

  private static final Logger log = LoggerFactory.getLogger(InspectionImporter.class);

  private final ImportPersister importPersister;

  /** This map groups all rows having the same importId. */
  private final Map<String, List<InspectionImporterRow>> rowsWithImportIds = new LinkedHashMap<>();

  /**
   * This map groups all rows not having an importId, but having <i>exactly</i> the same facility
   * data. Note that if two rows have no importId, but have <i>almost</i> the same facility data,
   * but not <i>exactly</i> the same, then this will be treated as totally different facilities!
   * Currently, there is no similarity search!
   */
  private final Map<ImportInspectionFacility, List<InspectionImporterRow>> rowsWithoutImportIds =
      new LinkedHashMap<>();

  /**
   * This is a cache for base facility searches ({@code FacilityApi.searchReferenceFacilities()}).
   * It is kept during the run of one import process. It maps search query parameters to responses.
   */
  private final Map<FacilitySearchParams, SearchReferenceFacilitiesResponse>
      facilityDuplicateCandidates = new HashMap<>();

  private Long firstImportedInspectionId = null;
  private int importedFacilities = 0;
  private int importedNewFacilities = 0;

  InspectionImporter(
      XSSFSheet sheet,
      RowReader<InspectionImporterRow, InspectionListColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      ImportPersister importPersister) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.importPersister = importPersister;
  }

  @Override
  protected void evaluateActionsForRows(List<InspectionImporterRow> rows) {
    Set<UUID> existingProcedureIds = fetchExistingProcedureIds(rows);

    for (InspectionImporterRow row : rows) {
      if (isDuplicateRow(row)) {
        markAsDuplicateWithinList(row);
      } else {
        if (row.getEntityId() != null) {
          if (existingProcedureIds.contains(row.getEntityId())) {
            writeStatus(row, IMPORTED_PREVIOUSLY);
            row.setStatus(IMPORTED_PREVIOUSLY);
            stats.countPreviouslyImported();
          } else {
            markWithError(row, INVALID_ENTITY_ID);
          }
        } else if (!row.isValid()) {
          markWithError(row, ERROR_INPUT_DATA);
        }
        if (row.getInspection().hasInvalidLastInspectedDate()) {
          // if the lastInspected date is invalid (e.g. it's defined by a formular
          // or something else) then omit this row entirely, because we don't know
          // how to fit it into any import batch.
          continue;
        }
        // Note that we even add rows with _invalid_ cells to the result maps!
        // (Well, except invalid inspectedAt dates, see above.)
        // This is intentional; in the next step createProceduresAndWriteResults() we'll
        // check if any batch of rows having the same (facility) importId has any error;
        // then we'll mark the _all_ rows of the same batch as error.
        if (row.hasImportId()) {
          rowsWithImportIds
              .computeIfAbsent(row.getFacility().importId(), _id -> new ArrayList<>())
              .add(row);
        } else {
          rowsWithoutImportIds.computeIfAbsent(row.getFacility(), _f -> new ArrayList<>()).add(row);
        }
        // Add to importableRows() for duplicate check in containsMatchingRow()
        if (row.isValid()) {
          addToImportableRows(row);
        }
      }
    }
  }

  @Override
  protected void createEntitiesAndWriteResults(List<InspectionImporterRow> importableRows) {
    searchFacilityDuplicateCandidates(importableRows);
    handleRowsWithImportIds();
    handleRowsWithoutImportIds();
  }

  private void searchFacilityDuplicateCandidates(List<InspectionImporterRow> importableRows) {
    facilityDuplicateCandidates.clear();
    Set<FacilitySearchParams> set = collectUniqueFacilitySearchParams(importableRows);
    importPersister.batchSearchForFacilityDuplicates(set, facilityDuplicateCandidates);
  }

  private Set<FacilitySearchParams> collectUniqueFacilitySearchParams(
      List<InspectionImporterRow> importableRows) {
    Set<FacilitySearchParams> set = new HashSet<>();
    for (InspectionImporterRow row : importableRows) {
      if (!hasError(row)) {
        String facilityName = row.getFacility().facilityDetailsDto().name();
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
  private void importBatch(List<InspectionImporterRow> batch) {
    // First of all sort the batch by ascending inspection date.
    batch.sort(Comparator.comparing(row -> row.getInspection().lastInspected()));

    // Try to import the facility first. Take the facility data of the _last valid_ row in this
    // batch, because the batch is sorted by ascending inspection date, and the last row contains
    // the _newest_ facility data. This will be the _reference_ facility. The other rows might
    // contain different facility data; these will be saved as different fileStates for the
    // reference facility. (PS: Note that if we're importing a batch from
    // 'handleRowsWithoutImportIds', then all rows will have exactly the same facility data, so it
    // doesn't matter if we take the first or last facility in this case.)
    Optional<InspectionImporterRow> rowForFacilityCandidate =
        batch.reversed().stream().filter(r -> !hasError(r)).findFirst();
    if (rowForFacilityCandidate.isEmpty()) {
      // If there's no a candidate then all rows in this batch are erroneous. No import then.
      return;
    }
    InspectionImporterRow rowForFacility = rowForFacilityCandidate.get();
    FacilityRef facilityRef;
    try {
      facilityRef = searchForDuplicatesAndAddFacility(rowForFacility.getFacility());
    } catch (Exception ex) {
      log.error("error importing row #{}", rowForFacility.getRowNum(), ex);
      markWithError(rowForFacility, EXCEPTION);
      // Since we could not add the facility, mark the other inspection rows of
      // the same batch as BATCH_ERROR, and proceed with next batch.
      batch.stream()
          .filter(row -> row != rowForFacility)
          .forEach(row -> markWithError(row, BATCH_ERROR));
      return;
    }

    // Count imported facility. Note that these counters are not part of ImportStatistics.
    countFacility();
    if (facilityRef.isNew()) {
      countNewFacility();
    }

    // Try to import inspections for this facility. Also create a new facility fileState for each
    // row. If an error occurs, then the remaining rows of the batch are marked with BATCH_ERROR,
    // and are not imported.
    boolean batchHasError = false;
    for (int i = 0; i < batch.size(); i++) {
      checkOtherInspectionsAtTheSameDay(batch, i);
      InspectionImporterRow row = batch.get(i);
      if (hasError(row)) {
        // mark remaining rows of the same batch as BATCH_ERROR
        batchHasError = true;
        continue;
      }
      if (batchHasError) {
        markWithError(row, BATCH_ERROR);
        continue;
      }
      try {
        importInspection(row, facilityRef);
      } catch (Exception ex) {
        log.error("error importing row #{}", row.getRowNum(), ex);
        markWithError(row, EXCEPTION);
        batchHasError = true;
      }
    }
  }

  private void checkOtherInspectionsAtTheSameDay(List<InspectionImporterRow> batch, int current) {
    InspectionImporterRow row = batch.get(current);
    ImportInspection importInspection = row.getInspection();
    for (int i = 0; i < current; i++) {
      ImportInspection otherInspection = batch.get(i).getInspection();
      if (importInspection.isSameDayAndResultAs(otherInspection)) {
        addErrorForCell(
            InspectionListColumn.INSPECTED_AT,
            "Es gibt eine andere Zeile mit derselben Begehung zur selben Zeit",
            row);
        markWithError(row, DUPLICATE_WITHIN_LIST);
        return;
      } else if (importInspection.isSameDayDifferentResultAs(otherInspection)) {
        addErrorForCell(
            InspectionListColumn.INSPECTION_RESULT,
            "Anderes Ergebnis als andere Begehung zur selben Zeit",
            row);
        markWithError(row, ERROR_INPUT_DATA);
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
  private FacilityRef searchForDuplicatesAndAddFacility(ImportInspectionFacility importFacility) {
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

  private void importInspection(InspectionImporterRow row, FacilityRef facilityRef) {
    Inspection inspection =
        importPersister.addInspection(
            row.getInspection(), row.getFacility(), facilityRef, firstImportedInspectionId);

    UUID procedureId = inspection.getExternalId();
    writeStatusAndEntityId(row, IMPORTED_SUCCESSFULLY, procedureId);
    row.setStatus(IMPORTED_SUCCESSFULLY);
    row.setEntityId(procedureId);
    stats.countCreated();

    if (firstImportedInspectionId == null) {
      firstImportedInspectionId = inspection.getId();
    }
  }

  private Set<UUID> fetchExistingProcedureIds(List<InspectionImporterRow> rows) {
    List<UUID> procedureIds =
        rows.stream().map(InspectionImporterRow::getEntityId).filter(Objects::nonNull).toList();
    return importPersister.fetchExistingProcedureIds(procedureIds);
  }

  private void countFacility() {
    importedFacilities++;
  }

  private void countNewFacility() {
    importedNewFacilities++;
  }

  int getImportedFacilities() {
    return importedFacilities;
  }

  int getImportedNewFacilities() {
    return importedNewFacilities;
  }

  private void markWithError(InspectionImporterRow row, ImportStatus error) {
    writeStatus(row, error);
    row.setStatus(error);
    if (error == DUPLICATE_WITHIN_LIST) {
      stats.countDuplicated();
    } else {
      stats.countFailed();
    }
  }

  private void addErrorForCell(
      InspectionListColumn col, String errorMessage, InspectionImporterRow row) {
    rowReader.addError(row, col, errorMessage);
  }

  private static boolean hasError(InspectionImporterRow row) {
    if (!row.isValid()) return true;
    return switch (row.getStatus()) {
      case null -> false;
      case ERROR_INPUT_DATA,
              INVALID_ENTITY_ID,
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
