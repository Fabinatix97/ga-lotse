/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.cronn.assertions.validationfile.junit5.JUnit5ValidationFileAssertions;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.eshg.normalization.UuidNormalizer;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.function.Consumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.Resource;

public interface XlsxAssertionTraits extends JUnit5ValidationFileAssertions {

  Path getTempFile(String suffix);

  default void assertStatisticsWithFile(ImportResponse response) {
    assertWithFileWithSuffix(response.statistics(), "statistics");
  }

  default void assertStatisticsWithFileWithSuffix(ImportResponse response, String suffix) {
    assertWithFileWithSuffix(response.statistics(), suffix + "_statistics");
  }

  default void assertXlsxWithFile(ImportResponse response) throws Exception {
    assertXlsxWithFile(response.file(), new UuidNormalizer(), "xlsx");
  }

  default void assertXlsxWithFileWithSuffix(ImportResponse response, String suffix)
      throws Exception {
    assertXlsxWithFile(response.file(), new UuidNormalizer(), suffix);
  }

  default void assertXlsxWithFile(
      Resource xlsx, ValidationNormalizer validationNormalizer, String suffix) throws Exception {
    byte[] content = xlsx.getContentAsByteArray();
    Files.write(getTempFile(".xlsx"), content);
    try (InputStream inputStream = new ByteArrayInputStream(content);
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
      StringBuilder sb = new StringBuilder();
      int sheetCounter = 1;
      int rowCounter = 1;
      int numberOfColumns = 0;
      for (Sheet sheet : workbook) {
        append(sb, "-- sheet %d --".formatted(sheetCounter++));

        append(sb, "-- row %d --".formatted(rowCounter++));
        Iterator<Row> rowIterator = sheet.rowIterator();
        Row headerRow = rowIterator.next();
        for (Cell cell : headerRow) {
          numberOfColumns++;
          append(sb, getCellProperties(cell));
        }

        while (rowIterator.hasNext()) {
          Row row = rowIterator.next();
          append(sb, "-- row %d --".formatted(rowCounter++));
          for (int columnCounter = 0; columnCounter < numberOfColumns; columnCounter++) {
            append(sb, getCellProperties(row.getCell(columnCounter)));
          }
        }
      }
      assertWithFileWithSuffix(sb.toString(), validationNormalizer, suffix);
    }
  }

  default void withXlsxSheet(ImportResponse response, Consumer<Sheet> consumer) throws IOException {
    byte[] content = response.file().getContentAsByteArray();
    Files.write(getTempFile(".xlsx"), content);
    try (InputStream inputStream = new ByteArrayInputStream(content);
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
      XSSFSheet sheet = workbook.getSheetAt(0);
      consumer.accept(sheet);
    }
  }

  private static void append(StringBuilder sb, String value) {
    sb.append(value);
    sb.append(System.lineSeparator());
  }

  private static String getCellProperties(Cell cell) {
    if (cell == null) {
      return "NULL;;";
    }
    String cellType = cell.getCellType().toString();
    String cellValue = getCellValue(cell);
    String cellComment = getCellComment(cell);

    return "%s;%s;%s".formatted(cellType, cellValue, cellComment);
  }

  static String getCellValue(Cell cell) {
    if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
      return cell.getLocalDateTimeCellValue().toLocalDate().toString();
    } else if (cell.getCellType() == CellType.NUMERIC) {
      return String.valueOf(cell.getNumericCellValue());
    } else {
      return cell.getStringCellValue();
    }
  }

  static String getCellComment(Cell cell) {
    if (cell.getCellComment() != null) {
      return cell.getCellComment().getString().getString();
    }
    return "";
  }
}
