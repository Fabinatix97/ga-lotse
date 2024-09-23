/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class XlsxNormalizer implements AutoCloseable {

  private final XSSFWorkbook normalizedWorkbook = new XSSFWorkbook();
  private final XSSFFont headerFont = createHeaderFont();
  private final XSSFFont defaultFont = createDefaultFont();
  private final Map<String, Short> dataFormats = new LinkedHashMap<>();
  private final Map<CellStyleData, XSSFCellStyle> cellStyles = new LinkedHashMap<>();

  private record CellStyleData(
      HorizontalAlignment alignment,
      VerticalAlignment verticalAlignment,
      boolean wrapText,
      String dataFormat,
      XSSFFont font) {}

  private XSSFFont createDefaultFont() {
    return XlsxUtil.createDefaultFont(normalizedWorkbook);
  }

  private XSSFFont createHeaderFont() {
    return createHeaderFont(normalizedWorkbook);
  }

  static XSSFFont createHeaderFont(XSSFWorkbook workbook) {
    XSSFFont headerFont = XlsxUtil.createDefaultFont(workbook);
    headerFont.setBold(true);
    return headerFont;
  }

  public XSSFSheet normalize(Sheet sheet) {
    XSSFSheet normalizedSheet = normalizedWorkbook.createSheet();

    for (Row row : sheet) {
      XSSFRow normalizedRow = normalizedSheet.createRow(row.getRowNum());

      if (row.getRowNum() == 0) {
        normalizedRow.setHeight(row.getHeight());
      }

      for (Cell cell : row) {
        XSSFCell normalizedCell =
            normalizedRow.createCell(cell.getColumnIndex(), cell.getCellType());

        if (row.getRowNum() == 0) {
          copyColumnWidth(sheet, normalizedSheet, cell.getColumnIndex());
        }
        copyCellValue(cell, normalizedCell);
        copyCellStyle(cell, normalizedCell);
      }
    }

    return normalizedSheet;
  }

  private void copyCellStyle(Cell cell, XSSFCell normalizedCell) {
    XSSFWorkbook normalizedWorkbook = normalizedCell.getSheet().getWorkbook();
    CellStyle cellStyle = cell.getCellStyle();
    CellStyleData cellStyleData =
        new CellStyleData(
            cellStyle.getAlignment(),
            cellStyle.getVerticalAlignment(),
            cellStyle.getWrapText(),
            cellStyle.getDataFormatString(),
            cell.getRowIndex() == 0 ? headerFont : defaultFont);
    XSSFCellStyle normalizedCellStyle = getOrCreateCellStyle(normalizedWorkbook, cellStyleData);
    normalizedCell.setCellStyle(normalizedCellStyle);
  }

  private short getOrCreateDataFormat(XSSFWorkbook normalizedWorkbook, String dataFormatString) {
    return dataFormats.computeIfAbsent(
        dataFormatString,
        formatString -> {
          XSSFDataFormat dataFormat = normalizedWorkbook.createDataFormat();
          return dataFormat.getFormat(formatString);
        });
  }

  private XSSFCellStyle getOrCreateCellStyle(XSSFWorkbook workbook, CellStyleData styleData) {
    return cellStyles.computeIfAbsent(styleData, data -> createCellStyle(workbook, data));
  }

  private XSSFCellStyle createCellStyle(XSSFWorkbook workbook, CellStyleData cellStyleData) {
    XSSFCellStyle cellStyle = workbook.createCellStyle();
    cellStyle.setAlignment(cellStyleData.alignment());
    cellStyle.setVerticalAlignment(cellStyleData.verticalAlignment());
    cellStyle.setWrapText(cellStyleData.wrapText());
    cellStyle.setFont(cellStyleData.font());
    cellStyle.setDataFormat(getOrCreateDataFormat(workbook, cellStyleData.dataFormat()));
    return cellStyle;
  }

  private static void copyCellValue(Cell source, Cell target) {
    switch (source.getCellType()) {
      case NUMERIC -> target.setCellValue(source.getNumericCellValue());
      case STRING -> target.setCellValue(source.getStringCellValue());
      case FORMULA -> target.setCellFormula(source.getCellFormula());
      case BOOLEAN -> target.setCellValue(source.getBooleanCellValue());
      default -> {
        // noop
      }
    }
  }

  private static void copyColumnWidth(Sheet source, Sheet target, int columnIndex) {
    target.setColumnWidth(columnIndex, source.getColumnWidth(columnIndex));
  }

  @Override
  public void close() throws IOException {
    normalizedWorkbook.close();
  }
}
