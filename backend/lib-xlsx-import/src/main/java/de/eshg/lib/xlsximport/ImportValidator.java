/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.eshg.lib.xlsximport.util.XlsxUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.*;
import java.util.stream.StreamSupport;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImportValidator {

  private static final Logger log = LoggerFactory.getLogger(ImportValidator.class);

  private static final String INVALID_FILE_STRUCTURE =
      "Invalid file structure. Headers do not match the expected structure.";

  private ImportValidator() {}

  static <C extends XlsxColumn> List<C> validateHeaderFormat(C[] expectedColumns, XSSFSheet sheet) {
    Row headerRow = sheet.getRow(0);
    XSSFCellStyle headerCellStyle = XlsxUtil.createHeaderCellStyle(sheet);
    List<C> foundColumns = new ArrayList<>();
    int initialNumberOfColumns = 0;

    for (C column : expectedColumns) {
      if (validateHeaderCellIsPresent(headerRow.getCell(foundColumns.size()), column)) {
        foundColumns.add(column);
        initialNumberOfColumns++;
      } else if (column.shouldAddIfMissing()) {
        addHeader(headerRow, column.getHeader(), column.getColumnWidth(), headerCellStyle);
        foundColumns.add(column);
      }
    }
    if (foundColumns.size() < headerRow.getLastCellNum() - 1) {
      log.error(
          "Found {} columns: {}. Header row has {} columns: {}",
          foundColumns.size(),
          foundColumns.stream().map(XlsxColumn::getHeader).toList(),
          headerRow.getLastCellNum(),
          StreamSupport.stream(headerRow.spliterator(), false)
              .map(Cell::getStringCellValue)
              .toList());
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

  private static void validateConsistencyBetweenHeaderAndRows(
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
}
