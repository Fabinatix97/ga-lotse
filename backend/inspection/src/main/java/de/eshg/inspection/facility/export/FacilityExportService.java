/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.export;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.inspection.facility.FacilityMapper;
import de.eshg.inspection.facility.FacilityService;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class FacilityExportService {

  private final FacilityRepository facilityRepository;
  private final FacilityService facilityService;
  private final Clock clock;

  public FacilityExportService(
      FacilityRepository facilityRepository, FacilityService facilityService, Clock clock) {
    this.facilityRepository = facilityRepository;
    this.facilityService = facilityService;
    this.clock = clock;
  }

  public Resource exportBannedFacilities() {
    return (exportFacilities(readBannedFacilities()));
  }

  public List<ExportedBannedFacility> readBannedFacilities() {
    List<Facility> facilities =
        facilityRepository.findAllByBannedTrueOrderByLastInspectedAscIdAsc();

    Map<UUID, GetFacilityFileStateResponse> baseFacilityMap =
        facilityService.fetchCentralFileData(extractCentralFileStateIds(facilities));

    return FacilityMapper.mapFacilitiesToExportedBannedFacility(
        facilities, baseFacilityMap, clock.getZone());
  }

  private static List<UUID> extractCentralFileStateIds(List<Facility> facilities) {
    return facilities.stream().map(Facility::getCentralFileStateId).toList();
  }

  private Resource exportFacilities(List<ExportedBannedFacility> facilities) {
    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      XSSFSheet sheet = workbook.createSheet("Untersagte Einrichtungen");

      CellStyle cellStyle = workbook.createCellStyle();
      cellStyle.setAlignment(HorizontalAlignment.LEFT);
      cellStyle.setDataFormat(
          workbook.getCreationHelper().createDataFormat().getFormat(("dd.MM.yyyy")));
      cellStyle.setQuotePrefixed(true);

      XSSFFont headerFont = workbook.createFont();
      headerFont.setBold(true);

      CellStyle headerCellStyle = workbook.createCellStyle();
      headerCellStyle.setAlignment(HorizontalAlignment.LEFT);
      headerCellStyle.setFont(headerFont);

      addHeaderRow(sheet, headerCellStyle, 0);
      addFacilityRows(sheet, cellStyle, 1, facilities);

      workbook.write(outputStream);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create export", exception);
    }
  }

  static void addHeaderRow(XSSFSheet sheet, CellStyle cellStyle, int rowNumber) {
    XSSFRow row = sheet.createRow(rowNumber);

    row.setRowStyle(cellStyle);

    int columnIndex = 0;
    for (FacilityListColumn column : FacilityListColumn.values()) {
      createStringCell(row, cellStyle, columnIndex, column.getHeader());
      sheet.setColumnWidth(columnIndex++, column.getColumnWidth());
    }
  }

  void addFacilityRows(
      XSSFSheet sheet,
      CellStyle cellStyle,
      int rowNumber,
      List<ExportedBannedFacility> facilities) {
    for (int i = 0; i < facilities.size(); i++) {
      addFacilityRow(sheet, cellStyle, rowNumber + i, facilities.get(i));
    }
  }

  void addFacilityRow(
      XSSFSheet sheet, CellStyle cellStyle, int rowNumber, ExportedBannedFacility facility) {
    XSSFRow row = sheet.createRow(rowNumber);

    int columnIndex = 0;
    for (FacilityListColumn column : FacilityListColumn.values()) {
      Object value = column.getValue(facility);
      if (value != null) {
        switch (value) {
          case String string -> createStringCell(row, cellStyle, columnIndex, string);
          case LocalDate localDate -> createDateCell(row, cellStyle, columnIndex, localDate);
          default ->
              throw new BadRequestException(
                  ErrorCode.UNEXPECTED_ERROR, "Unexpected column class: " + value.getClass());
        }
      }
      columnIndex++;
    }
  }

  private static void createStringCell(
      XSSFRow row, CellStyle cellStyle, int columnIndex, String value) {
    XSSFCell cell = row.createCell(columnIndex, CellType.STRING);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
  }

  private static void createDateCell(
      XSSFRow row, CellStyle cellStyle, int columnIndex, LocalDate value) {
    XSSFCell cell = row.createCell(columnIndex, CellType.NUMERIC);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
  }
}
