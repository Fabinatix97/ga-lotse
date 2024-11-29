/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.eshg.lib.xlsximport.util.XlsxUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

public class ImportValidator {

  private static final Logger log = LoggerFactory.getLogger(ImportValidator.class);

  private static final String INVALID_FILE_STRUCTURE =
      "Invalid file structure. Headers do not match the expected structure.";

  private ImportValidator() {}

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

  public static void validateNumberOfRows(Sheet sheet, int maxNumberOfImportRows) {
    if (sheet.getPhysicalNumberOfRows() > maxNumberOfImportRows) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE,
          "Invalid file structure. At most %s rows are allowed.".formatted(maxNumberOfImportRows));
    }
  }

  public static void validateHeaderExists(Sheet sheet) {
    Row headerRow = sheet.getRow(0);
    if (headerRow == null) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Invalid file structure. Missing header row.");
    }
  }

  public static void validateConsistencyBetweenHeaderAndRows(
      Sheet sheet, int headerRowNumberOfColumns) {
    for (Row row : sheet) {
      if (row.getRowNum() == 0) {
        // skip the header
        continue;
      }
      if (row.getLastCellNum() > headerRowNumberOfColumns) {
        log.error(
            "row {} has more data columns than header columns: {} > {}",
            row.getRowNum(),
            row.getLastCellNum(),
            headerRowNumberOfColumns);
        throw new BadRequestException(
            ErrorCode.INVALID_FILE,
            "Invalid file structure. Number of columns in header and data rows does not match.");
      }
    }
  }

  public static <T extends XlsxColumn> List<T> validateHeaderFormat(
      T[] expectedColumns, XSSFSheet sheet) {
    Row headerRow = sheet.getRow(0);
    XSSFCellStyle headerCellStyle = XlsxUtil.createHeaderCellStyle(sheet);
    List<T> foundColumns = new ArrayList<>();
    int initialNumberOfColumns = 0;

    for (T column : expectedColumns) {
      if (validateHeaderCellIsPresent(headerRow.getCell(foundColumns.size()), column)) {
        foundColumns.add(column);
        initialNumberOfColumns++;
      } else if (column.shouldAddIfMissing()) {
        addHeader(headerRow, column.getHeader(), column.getColumnWidth(), headerCellStyle);
        foundColumns.add(column);
      }
    }
    if (foundColumns.size() < headerRow.getLastCellNum() - 1) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, INVALID_FILE_STRUCTURE);
    }
    validateConsistencyBetweenHeaderAndRows(sheet, initialNumberOfColumns);
    return foundColumns;
  }

  static void addHeader(
      Row headerRow, String header, int columnWidth, XSSFCellStyle headerCellStyle) {
    Cell cell =
        writeValue(headerRow, headerRow.getPhysicalNumberOfCells(), header, headerCellStyle);
    // See the Javadoc of setColumnWidth(…) why we multiple with 256 here
    cell.getSheet().setColumnWidth(cell.getColumnIndex(), columnWidth * 256);
  }

  private static boolean validateHeaderCellIsPresent(Cell cell, XlsxColumn column) {
    String cellContent =
        Optional.ofNullable(cell).map(Cell::getStringCellValue).map(String::trim).orElse("");
    if (cellContent.equals(column.getHeader())) {
      return true;
    } else if (column.isOptional()) {
      return false;
    } else {
      log.error("missing required column \"{}\"", column.getHeader());
      throw new BadRequestException(ErrorCode.INVALID_FILE, INVALID_FILE_STRUCTURE);
    }
  }

  private static Cell writeValue(Row row, int columnIndex, String value, XSSFCellStyle cellStyle) {
    Cell cell = row.getCell(columnIndex);
    if (cell == null) {
      cell = row.createCell(columnIndex, CellType.STRING);
    }
    XlsxUtil.writeValue(cell, value, cellStyle);
    return cell;
  }
}
