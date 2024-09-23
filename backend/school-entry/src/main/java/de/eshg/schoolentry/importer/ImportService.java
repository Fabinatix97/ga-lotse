/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.ImportStatus.*;
import static de.eshg.schoolentry.util.ImportDataUtil.*;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.GenderDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.api.ImportStatisticsDto;
import de.eshg.schoolentry.business.model.*;
import de.eshg.schoolentry.config.SchoolEntryFeature;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Year;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

@Service
public class ImportService {

  private static final Logger log = LoggerFactory.getLogger(ImportService.class);

  private static final int STATUS_COLUMN_HEADER_WIDTH = 20;
  private static final int PROCEDURE_COLUMN_WIDTH = 36;

  private final SchoolEntryService schoolEntryService;
  private final SchoolEntryFeatureToggle schoolEntryFeatureToggle;

  public ImportService(
      SchoolEntryService schoolEntryService, SchoolEntryFeatureToggle schoolEntryFeatureToggle) {
    this.schoolEntryService = schoolEntryService;
    this.schoolEntryFeatureToggle = schoolEntryFeatureToggle;
  }

  public ImportResult processSheetAndPersistProcedures(
      Sheet sheet, ImportType importType, UUID schoolId, UUID locationId, Year schoolYear)
      throws IOException {
    try (XlsxNormalizer xlsxNormalizer = new XlsxNormalizer()) {
      XSSFSheet normalizedSheet = xlsxNormalizer.normalize(sheet);

      RowProcessor<? extends RowValues> rowProcessor =
          switch (importType) {
            case CITIZEN_LIST -> new CitizenListRowProcessor(normalizedSheet);
            case SCHOOL_LIST -> new SchoolListRowProcessor(normalizedSheet);
          };
      return new Importer<>(
              normalizedSheet, importType, rowProcessor, schoolId, locationId, schoolYear)
          .process();
    }
  }

  private class Importer<T extends RowValues> {
    private final XSSFSheet sheet;
    private final XSSFCellStyle headerCellStyle;
    private final XSSFCellStyle defaultCellStyle;
    private final ImportStatistics stats = new ImportStatistics();
    private final ValidRows<T> validRows = new ValidRows<>(new ArrayList<>(), new ArrayList<>());
    private final int statusColumn;
    private final int procedureColumn;
    private final int referenceIdColumn;
    private final ImportType importType;
    private final RowProcessor<T> rowProcessor;
    private final UUID schoolId;
    private final UUID locationId;
    private final Year schoolYear;
    private final XSSFCellStyle importedSuccessfullyCellStyle;
    private final XSSFCellStyle importFailedCellStyle;
    private final XSSFCellStyle importWarningCellStyle;

    private Importer(
        XSSFSheet sheet,
        ImportType importType,
        RowProcessor<T> rowProcessor,
        UUID schoolId,
        UUID locationId,
        Year schoolYear) {
      this.sheet = sheet;
      this.locationId = locationId;
      this.headerCellStyle = createHeaderCellStyle();
      this.defaultCellStyle = createDefaultCellStyle();

      this.importedSuccessfullyCellStyle =
          createCellStyle(
              font -> {
                font.setBold(true);
                font.setColor(XlsxUtil.newColor(76, 175, 80));
              });

      this.importFailedCellStyle =
          createCellStyle(
              font -> {
                font.setBold(true);
                font.setColor(XlsxUtil.newColor(176, 0, 0));
              });

      importWarningCellStyle =
          createCellStyle(
              font -> {
                font.setBold(true);
                font.setColor(XlsxUtil.newColor(228, 114, 0));
              });

      this.statusColumn = findOrAddHeader(STATUS_COLUMN_HEADER, STATUS_COLUMN_HEADER_WIDTH);
      this.procedureColumn = findOrAddHeader(PROCEDURE_COLUMN_HEADER, PROCEDURE_COLUMN_WIDTH);
      this.referenceIdColumn = findOrAddHeader(REFERENCE_COLUMN_HEADER, PROCEDURE_COLUMN_WIDTH);
      this.importType = importType;
      this.rowProcessor = rowProcessor;
      this.schoolId = schoolId;
      this.schoolYear = schoolYear;
    }

    private XSSFCellStyle createCellStyle(Consumer<XSSFFont> fontCustomizer) {
      XSSFCellStyle cellStyle = createDefaultCellStyle();
      XSSFFont font = cellStyle.getFont();
      fontCustomizer.accept(font);
      return cellStyle;
    }

    private XSSFCellStyle createHeaderCellStyle() {
      XSSFWorkbook workbook = sheet.getWorkbook();
      XSSFCellStyle cellStyle = workbook.createCellStyle();
      cellStyle.setFont(XlsxNormalizer.createHeaderFont(workbook));
      return cellStyle;
    }

    private XSSFCellStyle createDefaultCellStyle() {
      XSSFWorkbook workbook = sheet.getWorkbook();
      XSSFCellStyle cellStyle = workbook.createCellStyle();
      cellStyle.setFont(XlsxUtil.createDefaultFont(workbook));
      return cellStyle;
    }

    private ImportResult process() throws IOException {
      processRows();

      List<T> importableRows = validRows.importableRows();
      List<ImportProcedureData> importData =
          importableRows.stream().map(rowProcessor::mapValuesToImportData).toList();
      try {
        List<SchoolEntryProcedure> createdProcedures =
            schoolEntryService.createProcedures(
                importData, schoolId, locationId, schoolYear, DataOrigin.DATA_IMPORT);
        writeProcedureIdsInSheet(importableRows, createdProcedures);
      } catch (Exception e) {
        log.error("Failure during creating new procedures.", e);
        writeFailedStatusInSheet(importableRows);
        stats.correctCreatedToFailed(importableRows.size());
      }

      if (schoolEntryFeatureToggle.isNewFeatureEnabled(
          SchoolEntryFeature.MERGE_PROCEDURES_ON_IMPORT)) {
        List<T> mergeableRows = validRows.mergeableRows();
        List<MergeProcedureData> mergeData =
            mergeableRows.stream().map(rowProcessor::mapValuesToMergeData).toList();
        List<UUID> failedIds =
            schoolEntryService.mergeProcedures(
                mergeData, importType, schoolId, locationId, schoolYear);
        writeMergedFailedStatusInSheet(mergeableRows, failedIds);
        stats.correctMergeToFailed(failedIds.size());
      }

      try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
        sheet.getWorkbook().write(outputStream);
        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

        return new ImportResult(stats.mapToDto(), resource);
      }
    }

    private void processRows() {
      Map<Row, T> rowValues = new LinkedHashMap<>();
      for (Row row : sheet) {
        if (row.getRowNum() == 0) {
          // skip the header
          continue;
        }
        deleteReferenceId(row);
        try {
          rowValues.put(row, rowProcessor.processRow(row));
        } catch (Exception e) {
          log.error("Error in reading row %d".formatted(row.getRowNum()), e);
          writeStatus(row, EXCEPTION);
          stats.countFailed();
        }
      }

      List<UUID> procedureIds =
          rowValues.values().stream()
              .map(RowValues::getProcedureId)
              .filter(Objects::nonNull)
              .toList();
      List<UUID> existingProcedureIds = schoolEntryService.collectExistingProcedures(procedureIds);

      rowValues.forEach(
          (row, value) -> {
            if (value.getProcedureId() != null) {
              if (existingProcedureIds.contains(value.getProcedureId())) {
                writeStatus(row, IMPORTED_PREVIOUSLY);
                stats.countPreviouslyImported();
              } else {
                writeStatus(row, INVALID_PROCEDURE_ID);
                stats.countFailed();
              }
            } else if (value.getStatus() == DUPLICATE_WITHIN_LIST
                || containsMatchingRow(validRows, value)) {
              writeStatus(row, DUPLICATE_WITHIN_LIST);
              stats.countDuplicated();
            } else if (value.isValid()) {
              if (schoolEntryFeatureToggle.isNewFeatureEnabled(
                  SchoolEntryFeature.MERGE_PROCEDURES_ON_IMPORT)) {
                merge(row, value);
              } else {
                validRows.importableRows().add(value);
                stats.countCreated();
              }
            } else {
              writeStatus(row, ERROR_INPUT_DATA);
              stats.countFailed();
            }
          });
    }

    private void merge(Row row, T value) {
      List<ProcedureWithChildData> procedures =
          schoolEntryService.searchOpenProceduresByChildWithExactMatching(value.getChild());
      if (procedures.isEmpty()) {
        validRows.importableRows().add(value);
        stats.countCreated();
      } else if (procedures.size() > 1
          || procedures.getFirst().procedure().getProcedureType() != procedureTypeToMergeWith()) {
        writeStatusAndReferenceId(
            row, DUPLICATE_IN_ASSET, procedures.getFirst().procedure().getExternalId());
        stats.countMergeFailed();
      } else {
        ProcedureWithChildData procedure = procedures.getFirst();
        if (procedureMatchesImportValues(procedure, value)) {
          value.setProcedureId(procedure.procedure().getExternalId());
          validRows.mergeableRows().add(value);
          writeStatusAndProcedureId(row, MERGED_SUCCESSFULLY, procedure.procedure());
          stats.countMerged();
        } else {
          writeStatusAndReferenceId(row, DUPLICATE_IN_ASSET, procedure.procedure().getExternalId());
          stats.countMergeFailed();
        }
      }
    }

    private ProcedureType procedureTypeToMergeWith() {
      return switch (importType) {
        case CITIZEN_LIST -> ProcedureType.DRAFT_SCHOOL_IMPORT;
        case SCHOOL_LIST -> ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT;
      };
    }

    record ValidRows<T>(List<T> importableRows, List<T> mergeableRows) {}

    private void writeStatusAndProcedureId(
        Row row, ImportStatus status, SchoolEntryProcedure procedure) {
      writeStatus(row, status);
      writeValue(row, procedureColumn, procedure.getExternalId().toString(), defaultCellStyle);
    }

    private void deleteReferenceId(Row row) {
      writeValue(row, referenceIdColumn, "", defaultCellStyle);
    }

    private void deleteProcedureId(Row row) {
      writeValue(row, procedureColumn, "", defaultCellStyle);
    }

    private void writeStatusAndReferenceId(Row row, ImportStatus status, UUID referenceId) {
      writeStatus(row, status);
      writeValue(row, referenceIdColumn, referenceId.toString(), defaultCellStyle);
    }

    private boolean procedureMatchesImportValues(ProcedureWithChildData procedure, T values) {
      AddressDto address = procedure.child().address();
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
              && Objects.equals(
                  domesticAddressDto.addressAddition(), importAddress.addressAddition())
              && Objects.equals(
                  procedure.child().gender(),
                  Optional.ofNullable(values.getChild().gender()).orElse(GenderDto.NOT_SPECIFIED))
              && (procedure.procedure().getSchoolYear() == null
                  || Objects.equals(procedure.procedure().getSchoolYear(), schoolYear));

      if (!commonFieldsMatch) {
        return false;
      }

      return switch (importType) {
        case SCHOOL_LIST ->
            (procedure.procedure().getSchoolId() == null
                    || Objects.equals(procedure.procedure().getSchoolId(), schoolId))
                && (procedure.procedure().getLocationId() == null
                    || Objects.equals(procedure.procedure().getLocationId(), locationId));
        case CITIZEN_LIST ->
            (procedure.child().placeOfBirth() == null
                    || Objects.equals(
                        procedure.child().placeOfBirth(), values.getChild().placeOfBirth()))
                && (procedure.child().countryOfBirth() == null
                    || Objects.equals(
                        procedure.child().countryOfBirth(), values.getChild().countryOfBirth()));
      };
    }

    private void writeStatus(Row row, ImportStatus importStatus) {
      writeValue(row, statusColumn, importStatus.getDescription(), getCellStyle(importStatus));
    }

    private XSSFCellStyle getCellStyle(ImportStatus importStatus) {
      return switch (importStatus) {
        case IMPORTED_SUCCESSFULLY, MERGED_SUCCESSFULLY -> importedSuccessfullyCellStyle;
        case ERROR_INPUT_DATA, INVALID_PROCEDURE_ID, EXCEPTION, MERGE_FAILED ->
            importFailedCellStyle;
        case IMPORTED_PREVIOUSLY, DUPLICATE_WITHIN_LIST, DUPLICATE_IN_ASSET ->
            importWarningCellStyle;
      };
    }

    private void writeProcedureIdsInSheet(
        List<T> importableRows, List<SchoolEntryProcedure> createdProcedures) {
      for (int i = 0; i < importableRows.size(); i++) {
        T rowValues = importableRows.get(i);
        SchoolEntryProcedure createdProcedure = createdProcedures.get(i);

        Row row = rowValues.getRow();
        writeStatusAndProcedureId(row, IMPORTED_SUCCESSFULLY, createdProcedure);
      }
    }

    private void writeMergedFailedStatusInSheet(List<T> mergeableRows, List<UUID> failedIds) {
      for (UUID uuid : failedIds) {
        Row row =
            mergeableRows.stream()
                .filter(values -> Objects.equals(uuid, values.getProcedureId()))
                .collect(StreamUtil.toSingleElement())
                .getRow();
        deleteProcedureId(row);
        writeStatusAndReferenceId(row, MERGE_FAILED, uuid);
      }
    }

    private void writeFailedStatusInSheet(List<T> importableRows) {
      for (T rowValues : importableRows) {
        writeStatus(rowValues.getRow(), EXCEPTION);
      }
    }

    private boolean containsMatchingRow(ValidRows<T> rows, T values) {
      return Stream.concat(rows.importableRows().stream(), rows.mergeableRows().stream())
          .anyMatch(row -> rowProcessor.equalRowValues(row, values));
    }

    private int findOrAddHeader(String header, int columnWidth) {
      Row headerRow = getHeaderRow(sheet);
      return findHeaderIndexByText(headerRow, header)
          .orElseGet(
              () -> {
                Cell cell =
                    writeValue(
                        headerRow, headerRow.getPhysicalNumberOfCells(), header, headerCellStyle);
                // See the Javadoc of setColumnWidth(…) why we multiple with 256 here
                cell.getSheet().setColumnWidth(cell.getColumnIndex(), columnWidth * 256);
                return cell.getColumnIndex();
              });
    }

    private static Cell writeValue(
        Row row, int columnIndex, String value, XSSFCellStyle cellStyle) {
      Cell cell = row.getCell(columnIndex);
      if (cell == null) {
        cell = row.createCell(columnIndex, CellType.STRING);
      }
      cell.setCellValue(value);
      cell.setCellStyle(cellStyle);

      return cell;
    }
  }

  static class ImportStatistics {
    private int created = 0;
    private int merged = 0;
    private int mergeFailed = 0;
    private int duplicated = 0;
    private int failed = 0;
    private int previouslyImported = 0;

    void countCreated() {
      created++;
    }

    void countMerged() {
      merged++;
    }

    void countMergeFailed() {
      mergeFailed++;
    }

    void countDuplicated() {
      duplicated++;
    }

    void countFailed() {
      failed++;
    }

    void countPreviouslyImported() {
      previouslyImported++;
    }

    void correctMergeToFailed(int count) {
      if (merged < count) {
        throw new IllegalStateException("Count correction failed.");
      }
      merged -= count;
      mergeFailed += count;
    }

    void correctCreatedToFailed(int count) {
      if (created < count) {
        throw new IllegalStateException("Count correction failed.");
      }
      created -= count;
      failed += count;
    }

    ImportStatisticsDto mapToDto() {
      return new ImportStatisticsDto(
          created + merged + mergeFailed + duplicated + failed + previouslyImported,
          created,
          merged,
          mergeFailed,
          duplicated,
          failed);
    }
  }
}
