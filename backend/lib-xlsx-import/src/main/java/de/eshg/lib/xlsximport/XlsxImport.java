/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;
import org.apache.poi.openxml4j.exceptions.NotOfficeXmlFileException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public class XlsxImport {

  private static final Logger log = LoggerFactory.getLogger(XlsxImport.class);

  private XlsxImport() {}

  @FunctionalInterface
  public interface SheetProcessor<T, C extends XlsxColumn> {
    T process(XSSFSheet sheet, List<C> actualColumns) throws IOException;
  }

  public static <T, C extends XlsxColumn> T processWorkbook(
      MultipartFile file,
      int maxNumberOfRows,
      C[] expectedColumns,
      SheetProcessor<T, C> sheetProcessor)
      throws IOException {
    return processWorkbook(file.getResource(), maxNumberOfRows, expectedColumns, sheetProcessor);
  }

  public static <T, C extends XlsxColumn> T processWorkbook(
      Resource resource,
      int maxNumberOfRows,
      C[] expectedColumns,
      SheetProcessor<T, C> sheetProcessor)
      throws IOException {
    validateFileExistsAndHasCorrectType(resource);
    try (InputStream inputStream = resource.getInputStream();
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
      validateSheet(workbook);
      Sheet sheet = workbook.getSheetAt(0);

      validateNumberOfRows(sheet, maxNumberOfRows);
      validateHeaderExists(sheet);

      try (XlsxNormalizer xlsxNormalizer = new XlsxNormalizer()) {
        XSSFSheet normalizedSheet = xlsxNormalizer.normalize(sheet);
        List<C> actualColumns =
            ImportValidator.validateHeaderFormat(expectedColumns, normalizedSheet);
        return sheetProcessor.process(normalizedSheet, actualColumns);
      }
    } catch (NotOfficeXmlFileException e) {
      log.error("Failed to import from provided XLSX file", e);
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "The provided file is not a valid XLSX document.");
    }
  }

  private static void validateFileExistsAndHasCorrectType(Resource resource) {
    if (!resource.exists()) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "The file %s does not exist.".formatted(resource.getFilename()));
    }
    if (!Objects.requireNonNull(resource.getFilename()).endsWith(".xlsx")) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, "The file type is not xlsx.");
    }
  }

  private static void validateSheet(XSSFWorkbook workbook) {
    if (workbook.getNumberOfSheets() != 1) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Invalid file structure. Exactly one sheet is required.");
    }
  }

  private static void validateNumberOfRows(Sheet sheet, int maxNumberOfImportRows) {
    if (sheet.getPhysicalNumberOfRows() > maxNumberOfImportRows) {
      throw new BadRequestException(
          ErrorCode.XLSX_TOO_MANY_ROWS,
          "Invalid file structure. At most %s rows are allowed.".formatted(maxNumberOfImportRows));
    }
  }

  private static void validateHeaderExists(Sheet sheet) {
    Row headerRow = sheet.getRow(0);
    if (headerRow == null) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Invalid file structure. Missing header row.");
    }
  }
}
