/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport.util;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public final class XlsxUtil {

  private static final String DEFAULT_FONT = "Arial";
  private static final float DEFAULT_FONT_SIZE = 10.0f;

  private XlsxUtil() {}

  public static XSSFColor newColor(int red, int green, int blue) {
    return new XSSFColor(new byte[] {(byte) red, (byte) green, (byte) blue});
  }

  public static XSSFFont createDefaultFont(XSSFWorkbook workbook) {
    XSSFFont font = workbook.createFont();
    font.setFontName(DEFAULT_FONT);
    font.setFontHeight(DEFAULT_FONT_SIZE);
    return font;
  }

  public static XSSFFont createHeaderFont(XSSFWorkbook workbook) {
    XSSFFont headerFont = createDefaultFont(workbook);
    headerFont.setBold(true);
    return headerFont;
  }

  public static XSSFCellStyle createDefaultCellStyle(XSSFSheet sheet) {
    XSSFWorkbook workbook = sheet.getWorkbook();
    XSSFCellStyle cellStyle = workbook.createCellStyle();
    cellStyle.setFont(createDefaultFont(workbook));
    return cellStyle;
  }

  public static XSSFCellStyle createHeaderCellStyle(XSSFSheet sheet) {
    XSSFWorkbook workbook = sheet.getWorkbook();
    XSSFCellStyle cellStyle = workbook.createCellStyle();
    cellStyle.setFont(createHeaderFont(workbook));
    return cellStyle;
  }

  public static void writeValue(Cell cell, String value, XSSFCellStyle cellStyle) {
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
  }
}
