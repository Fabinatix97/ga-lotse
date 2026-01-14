/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.file.common.FileValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.apache.poi.openxml4j.exceptions.NotOfficeXmlFileException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public class XlsxImport {

  private static final Logger log = LoggerFactory.getLogger(XlsxImport.class);

  private static final String NOT_A_VALID_XLSX_ERROR_MESSAGE =
      "The provided file is not a valid XLSX document.";

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
    validateMediaType(FileValidator.validate(file));
    try (InputStream inputStream = file.getInputStream();
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
      throw new BadRequestException(ErrorCode.INVALID_FILE, NOT_A_VALID_XLSX_ERROR_MESSAGE);
    }
  }

  private static void validateMediaType(MediaType detectedMediaType) {
    if (!CustomMediaTypes.APPLICATION_XLSX.equals(detectedMediaType)) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE,
          NOT_A_VALID_XLSX_ERROR_MESSAGE,
          "The detected media type %s is not %s"
              .formatted(detectedMediaType, CustomMediaTypes.APPLICATION_XLSX_VALUE));
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
