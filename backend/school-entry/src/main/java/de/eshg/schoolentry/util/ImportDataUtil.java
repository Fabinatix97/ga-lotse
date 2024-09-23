/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

public class ImportDataUtil {

  public static final String STATUS_COLUMN_HEADER = "Importstatus";
  public static final String PROCEDURE_COLUMN_HEADER = "Vorgangs-ID";
  public static final String REFERENCE_COLUMN_HEADER = "Referenz-ID";
  public static final List<String> EXPECTED_COLUMNS_REIMPORT =
      List.of(STATUS_COLUMN_HEADER, PROCEDURE_COLUMN_HEADER, REFERENCE_COLUMN_HEADER);

  private static final List<String> CITIZEN_LIST_EXPECTED_COLUMNS_CHILD =
      List.of(
          "Nachname",
          "Vorname",
          "Straße",
          "Hausnummer",
          "PLZ",
          "Ort",
          "Adresszusatz",
          "Geburtsdatum",
          "Geburtsort",
          "Geburtsland (Länderkürzel nach ISO 3166-1, Bsp. Deutschland = DE, Türkei = TK, Syrien = SY)",
          "Geschlecht (Männlich = M, Weiblich = W, Divers = D, Unbekannt = U)");
  private static final List<String> CITIZEN_LIST_EXPECTED_COLUMNS_CUSTODIAN =
      List.of(
          "Nachname PSB",
          "Vorname PSB",
          "Straße PSB",
          "Hausnummer PSB",
          "PLZ PSB",
          "Ort PSB",
          "Adresszusatz PSB",
          "Geburtsdatum PSB",
          "Titel PSB",
          "Anrede (Herr, Frau, Neutral, Unbekannt) PSB",
          "Geschlecht (Männlich = M, Weiblich = W, Divers = D, Unbekannt = U) PSB");

  private static final List<String> SCHOOL_LIST_EXPECTED_COLUMNS =
      List.of(
          "Name",
          "Vorname",
          "Geburtsdatum",
          "Geschlecht (Männlich = M, Weiblich = W, Divers = D,  Unbekannt = U)",
          "Straße",
          "Hausnummer",
          "PLZ",
          "Ort",
          "Adresszusatz",
          "Telefonnummer",
          "Eingangsstufe (Ja = X)",
          "Frühe Untersuchung (Ja = X)");

  private static final String INVALID_FILE_STRUCTURE =
      "Invalid file structure. Headers do not match the expected structure.";

  private ImportDataUtil() {}

  public static void validateFileExistsAndHasCorrectType(MultipartFile file) {
    if (!file.getResource().exists()) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "The file %s does not exist.".formatted(file.getName()));
    }
    if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".xlsx")) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, "The file type is not xlsx.");
    }
  }

  public static void validateSheet(XSSFWorkbook workbook) {
    if (workbook.getNumberOfSheets() != 1) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Invalid file structure. Exactly one sheet is required.");
    }
  }

  public static void validateHeaderExists(Sheet sheet) {
    Row headerRow = sheet.getRow(0);
    if (headerRow == null) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Invalid file structure. Missing header row.");
    }
  }

  public static void validateConsistencyBetweenHeaderAndRows(Sheet sheet) {
    Row headerRow = sheet.getRow(0);
    for (Row row : sheet) {
      if (rowHasMoreColumnsThanHeader(row, headerRow)) {
        throw new BadRequestException(
            ErrorCode.INVALID_FILE,
            "Invalid file structure. Number of columns in header and data rows does not match.");
      }
    }
  }

  private static boolean rowHasMoreColumnsThanHeader(Row dataRow, Row headerRow) {
    return dataRow.getLastCellNum() > headerRow.getLastCellNum();
  }

  public static void validateCitizenListHeaderFormat(Sheet sheet) {
    Row headerRow = sheet.getRow(0);

    int numberOfCellsWithoutReimport = headerRow.getPhysicalNumberOfCells();
    if (isReimport(headerRow)) {
      numberOfCellsWithoutReimport -= EXPECTED_COLUMNS_REIMPORT.size();
    }

    if (numberOfCellsWithoutReimport % 11 != 0) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, INVALID_FILE_STRUCTURE);
    }
    int countCustodians = 0;
    for (int i = 0; i < headerRow.getPhysicalNumberOfCells(); i++) {
      if (i < 11) {
        validateHeaderCell(headerRow.getCell(i), CITIZEN_LIST_EXPECTED_COLUMNS_CHILD.get(i));
      } else if (i >= numberOfCellsWithoutReimport) {
        validateHeaderCell(
            headerRow.getCell(i), EXPECTED_COLUMNS_REIMPORT.get(i - numberOfCellsWithoutReimport));
      } else {
        if (i % 11 == 0) {
          countCustodians++;
        }
        validateHeaderCell(
            headerRow.getCell(i),
            CITIZEN_LIST_EXPECTED_COLUMNS_CUSTODIAN.get(i % 11) + countCustodians);
      }
    }
  }

  public static void validateSchoolListHeaderFormat(Sheet sheet) {
    Row headerRow = sheet.getRow(0);

    int numberOfCellsWithoutReimport = headerRow.getPhysicalNumberOfCells();
    if (isReimport(headerRow)) {
      numberOfCellsWithoutReimport -= EXPECTED_COLUMNS_REIMPORT.size();
    }

    for (int i = 0; i < headerRow.getPhysicalNumberOfCells(); i++) {
      if (i >= numberOfCellsWithoutReimport) {
        validateHeaderCell(
            headerRow.getCell(i), EXPECTED_COLUMNS_REIMPORT.get(i - numberOfCellsWithoutReimport));
      } else {
        validateHeaderCell(headerRow.getCell(i), SCHOOL_LIST_EXPECTED_COLUMNS.get(i));
      }
    }
  }

  private static void validateHeaderCell(Cell cell, String expectedValue) {
    if (!cell.getStringCellValue().trim().equals(expectedValue)) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, INVALID_FILE_STRUCTURE);
    }
  }

  public static int computeNumberOfInputColumns(Sheet sheet) {
    Row headerRow = getHeaderRow(sheet);
    int numberOfCells = headerRow.getPhysicalNumberOfCells();

    return isReimport(headerRow) ? numberOfCells - EXPECTED_COLUMNS_REIMPORT.size() : numberOfCells;
  }

  private static boolean isReimport(Row headerRow) {
    return EXPECTED_COLUMNS_REIMPORT.stream().allMatch(header -> headerExists(headerRow, header));
  }

  public static Row getHeaderRow(Sheet sheet) {
    return sheet.getRow(0);
  }

  private static boolean headerExists(Row headerRow, String headerText) {
    return findHeaderIndexByText(headerRow, headerText).isPresent();
  }

  public static Optional<Integer> findHeaderIndexByText(Row headerRow, String headerText) {
    for (Cell cell : headerRow) {
      if (cell.getCellType() == CellType.STRING && headerText.equals(cell.getStringCellValue())) {
        return Optional.of(cell.getColumnIndex());
      }
    }
    return Optional.empty();
  }
}
