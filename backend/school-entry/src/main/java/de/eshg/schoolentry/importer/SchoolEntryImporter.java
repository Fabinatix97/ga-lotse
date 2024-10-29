/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_IN_ASSET;
import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_WITHIN_LIST;
import static de.eshg.lib.xlsximport.ImportStatus.ERROR_INPUT_DATA;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_PREVIOUSLY;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;
import static de.eshg.lib.xlsximport.ImportStatus.INVALID_PROCEDURE_ID;
import static de.eshg.lib.xlsximport.ImportStatus.MERGED_SUCCESSFULLY;
import static de.eshg.lib.xlsximport.ImportStatus.MERGE_FAILED;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.GenderDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.lib.xlsximport.model.AddressData;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.business.model.ProcedureWithChildData;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.util.ExceptionUtil;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

public abstract class SchoolEntryImporter<T extends SchoolEntryRowValues, C extends XlsxColumn>
    extends Importer<T, C> {

  protected static final Logger log = LoggerFactory.getLogger(SchoolEntryImporter.class);

  protected final ImportType importType;
  protected final UUID schoolId;
  protected final UUID locationId;
  protected final Year schoolYear;
  protected final SchoolEntryService schoolEntryService;
  protected final SchoolEntryProperties schoolEntryProperties;

  protected SchoolEntryImporter(
      XSSFSheet sheet,
      RowReader<T, C> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      ImportType importType,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      SchoolEntryService schoolEntryService,
      SchoolEntryProperties schoolEntryProperties) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.importType = importType;
    this.schoolId = schoolId;
    this.locationId = locationId;
    this.schoolYear = schoolYear;
    this.schoolEntryService = schoolEntryService;
    this.schoolEntryProperties = schoolEntryProperties;
  }

  @Override
  protected void readRowsAndEvaluateActions() {
    Map<Row, T> rowValues = readRows();

    List<UUID> existingProcedureIds = fetchExistingProceduresIfNecessary(rowValues);
    Map<PersonKeyAttributes, List<ProcedureWithChildData>> mergeCandidates =
        fetchMergeCandidatesIfNecessary(rowValues);

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

  private Map<PersonKeyAttributes, List<ProcedureWithChildData>> fetchMergeCandidatesIfNecessary(
      Map<Row, T> rowValues) {
    Map<PersonKeyAttributes, List<ProcedureWithChildData>> mergeCandidates;
    if (importType.supportsMerge()) {
      Set<PersonKeyAttributes> rowsToSearchFor =
          rowValues.values().stream()
              .filter(row -> row.getProcedureId() == null)
              .filter(SchoolEntryRowValues::isValid)
              .map(SchoolEntryRowValues::getChildKeyAttributes)
              .collect(StreamUtil.toLinkedHashSet());
      mergeCandidates = schoolEntryService.searchForMergeCandidates(rowsToSearchFor);
    } else {
      mergeCandidates = Map.of();
    }
    return mergeCandidates;
  }

  private void evaluateActionForRow(
      Row row,
      T rowValues,
      List<UUID> existingProcedureIds,
      Map<PersonKeyAttributes, List<ProcedureWithChildData>> mergeCandidates) {

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
      if (importType.supportsMerge()) {
        evaluateActionWhenMergeIsEnabled(row, rowValues, mergeCandidates);
      } else {
        validRows.importableRows().add(rowValues);
        stats.countCreated();
      }
    } else {
      writeStatus(row, ERROR_INPUT_DATA);
      stats.countFailed();
    }
  }

  protected boolean containsMatchingRow(ValidRows<T> rows, T values) {
    return Stream.concat(rows.importableRows().stream(), rows.mergeableRows().stream())
        .anyMatch(row -> row.isDuplicateRow(values));
  }

  protected void evaluateActionWhenMergeIsEnabled(
      Row row, T value, Map<PersonKeyAttributes, List<ProcedureWithChildData>> mergeCandidates) {
    List<ProcedureWithChildData> procedures =
        mergeCandidates.getOrDefault(value.getChildKeyAttributes(), List.of());
    if (procedures.isEmpty()) {
      validRows.importableRows().add(value);
      stats.countCreated();
    } else if (procedures.size() > 1
        || procedures.getFirst().procedure().getProcedureType() != procedureTypeToMergeWith()) {
      writeStatusAndReferenceId(
          row, DUPLICATE_IN_ASSET, procedures.getFirst().procedure().getExternalId());
      stats.countMergeFailed();
    } else {
      Assert.isTrue(
          !schoolEntryProperties.isDirectProcedureTypeAssignmentOnImport(),
          "Procedures of a draft type should not exist when direct procedure type assignment is enabled.");
      ProcedureWithChildData procedure = procedures.getFirst();
      UUID procedureId = procedure.procedure().getExternalId();
      if (mergeCandidateMatchesImportValues(procedure, value)) {
        if (validRows.mergeableRows().stream()
            .anyMatch(mergeableRow -> mergeableRow.getProcedureId().equals(procedureId))) {
          log.error("Procedure ID {} already found in a previous mergeable row", procedureId);
          writeStatusAndReferenceId(row, MERGE_FAILED, procedureId);
          stats.countMergeFailed();
        } else {
          value.setProcedureId(procedureId);
          validRows.mergeableRows().add(value);
          writeStatusAndProcedureId(row, MERGED_SUCCESSFULLY, procedureId);
          stats.countMerged();
        }
      } else {
        writeStatusAndReferenceId(row, DUPLICATE_IN_ASSET, procedureId);
        stats.countMergeFailed();
      }
    }
  }

  private ProcedureType procedureTypeToMergeWith() {
    return switch (importType) {
      case CITIZEN_LIST -> ProcedureType.DRAFT_SCHOOL_IMPORT;
      case SCHOOL_LIST -> ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT;
      case PAST_PROCEDURE_LIST -> throw ExceptionUtil.mergeNotSupportedForPastProcedureImport();
    };
  }

  private boolean mergeCandidateMatchesImportValues(
      ProcedureWithChildData mergeCandidate, T values) {
    AddressDto address = mergeCandidate.child().address();
    if (address instanceof PostboxAddressDto) {
      return false;
    }
    DomesticAddressDto domesticAddressDto = (DomesticAddressDto) address;
    AddressData importAddress = values.getChild().address();
    boolean commonFieldsMatch =
        Objects.equals(domesticAddressDto.street(), importAddress.street())
            && Objects.equals(domesticAddressDto.city(), importAddress.city())
            && Objects.equals(domesticAddressDto.houseNumber(), importAddress.houseNumber())
            && Objects.equals(domesticAddressDto.postalCode(), importAddress.postalCode())
            && Objects.equals(domesticAddressDto.addressAddition(), importAddress.addressAddition())
            && Objects.equals(
                mergeCandidate.child().gender(),
                Optional.ofNullable(values.getChild().gender()).orElse(GenderDto.NOT_SPECIFIED))
            && (mergeCandidate.procedure().getSchoolYear() == null
                || Objects.equals(mergeCandidate.procedure().getSchoolYear(), schoolYear));

    if (!commonFieldsMatch) {
      return false;
    }

    return switch (importType) {
      case SCHOOL_LIST ->
          (mergeCandidate.procedure().getSchoolId() == null
                  || Objects.equals(mergeCandidate.procedure().getSchoolId(), schoolId))
              && (mergeCandidate.procedure().getLocationId() == null
                  || Objects.equals(mergeCandidate.procedure().getLocationId(), locationId));
      case CITIZEN_LIST ->
          (mergeCandidate.child().placeOfBirth() == null
                  || Objects.equals(
                      mergeCandidate.child().placeOfBirth(), values.getChild().placeOfBirth()))
              && (mergeCandidate.child().countryOfBirth() == null
                  || Objects.equals(
                      mergeCandidate.child().countryOfBirth(), values.getChild().countryOfBirth()));
      case PAST_PROCEDURE_LIST -> throw ExceptionUtil.mergeNotSupportedForPastProcedureImport();
    };
  }

  @Override
  protected void createProceduresAndWriteResults() {
    List<T> importableRows = validRows.importableRows();
    try {
      List<SchoolEntryProcedure> createdProcedures = createProcedures(importableRows);
      writeProcedureIdsInSheet(importableRows, createdProcedures);
    } catch (Exception e) {
      log.error("Failure during creating new procedures.", e);
      writeFailedStatusInSheet(importableRows);
      stats.correctCreatedToFailed(importableRows.size());
    }
  }

  protected abstract List<SchoolEntryProcedure> createProcedures(List<T> importableRows);

  private void writeProcedureIdsInSheet(
      List<T> importableRows, List<SchoolEntryProcedure> createdProcedures) {
    for (int i = 0; i < importableRows.size(); i++) {
      T rowValues = importableRows.get(i);
      SchoolEntryProcedure createdProcedure = createdProcedures.get(i);

      Row row = rowValues.getRow();
      writeStatusAndProcedureId(row, IMPORTED_SUCCESSFULLY, createdProcedure.getExternalId());
    }
  }

  @Override
  protected void mergeProceduresAndWriteResults() {
    if (importType.supportsMerge()) {
      List<T> mergeableRows = validRows.mergeableRows();
      List<UUID> failedProcedureIds = mergeProceduresAndGetFailedProcedureIds(mergeableRows);
      writeMergedFailedStatusInSheet(mergeableRows, failedProcedureIds);
      stats.correctMergeToFailed(failedProcedureIds.size());
    }
  }

  protected abstract List<UUID> mergeProceduresAndGetFailedProcedureIds(List<T> mergeableRows);
}
