/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.xlsximport.model.AddressData;
import de.eshg.lib.xlsximport.util.XlsxUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.*;
import org.springframework.util.StringUtils;

public abstract class RowReader<T extends RowValues<T>, C extends XlsxColumn> {

  private static final DataFormatter DATA_FORMATTER = new DataFormatter();

  private final List<C> actualColumns;
  private final CellStyle errorCellStyle;
  private final Drawing<?> drawing;
  private final CreationHelper factory;

  protected RowReader(Sheet sheet, List<C> actualColumns) {
    Workbook workbook = sheet.getWorkbook();

    this.actualColumns = actualColumns;
    errorCellStyle = createErrorStyle(workbook);
    drawing = sheet.createDrawingPatriarch();
    factory = workbook.getCreationHelper();
  }

  public T readRow(Row row) {
    ColumnAccessor<C> col = new ColumnAccessor<>(row, actualColumns);
    T result = read(col);
    result.setRow(row);

    return result;
  }

  protected abstract T read(ColumnAccessor<C> col);

  protected ImportStatus readStatus(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String status = cellAsString(cell, true, false, errorHandler);
    if (!StringUtils.hasLength(status)) {
      return null;
    }

    try {
      return ImportStatus.map(status);
    } catch (NoSuchElementException e) {
      errorHandler.handleError(cell, "Ungültiger Wert");
      return null;
    }
  }

  protected UUID readProcedureId(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String uuid = cellAsString(cell, true, false, errorHandler);
    if (!StringUtils.hasLength(uuid)) {
      return null;
    }

    try {
      return UUID.fromString(uuid);
    } catch (IllegalArgumentException e) {
      errorHandler.handleError(cell, "Ungültiges Format");
      return null;
    }
  }

  public ErrorHandler createErrorHandler(T result) {
    return (cell, errorMessage) -> {
      result.foundInvalidData();
      addCellError(cell, errorMessage);
    };
  }

  protected void addCellError(Cell cell, String errorMessage) {
    cell.setCellStyle(errorCellStyle);
    if (cell.getCellComment() == null) {
      cell.setCellComment(createComment(cell, errorMessage));
    }
  }

  private CellStyle createErrorStyle(Workbook workbook) {
    CellStyle errorStyle = workbook.createCellStyle();
    errorStyle.setFillForegroundColor(XlsxUtil.newColor(255, 215, 215));
    errorStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

    return errorStyle;
  }

  private Comment createComment(Cell cell, String errorMessage) {
    Comment comment = drawing.createCellComment(createClientAnchor(cell));
    comment.setString(factory.createRichTextString(errorMessage));

    return comment;
  }

  private ClientAnchor createClientAnchor(Cell cell) {
    ClientAnchor clientAnchor = factory.createClientAnchor();
    clientAnchor.setCol1(cell.getColumnIndex());
    clientAnchor.setRow1(cell.getRowIndex());
    clientAnchor.setCol2(cell.getColumnIndex());
    clientAnchor.setRow2(cell.getRowIndex());
    return clientAnchor;
  }

  protected String cellAsString(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    return cellAsString(col.get(column), errorHandler);
  }

  protected static String cellAsString(Cell cell, ErrorHandler errorHandler) {
    return cellAsString(cell, false, false, errorHandler);
  }

  protected String cellAsString(
      ColumnAccessor<C> col,
      C column,
      boolean optional,
      boolean allowCellTypeNumeric,
      ErrorHandler errorHandler) {
    return cellAsString(col.get(column), optional, allowCellTypeNumeric, errorHandler);
  }

  protected static String cellAsString(
      Cell cell, boolean optional, boolean allowCellTypeNumeric, ErrorHandler errorHandler) {
    List<CellType> expectedTypes =
        allowCellTypeNumeric
            ? List.of(CellType.STRING, CellType.NUMERIC)
            : List.of(CellType.STRING);

    if (isOptionalBlank(cell, optional) || invalidType(cell, expectedTypes, errorHandler)) {
      return null;
    }

    if (allowCellTypeNumeric) {
      return DATA_FORMATTER.formatCellValue(cell).trim();
    } else {
      return cell.getStringCellValue().trim();
    }
  }

  protected Cell convertToTextCell(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    return convertToTextCell(col.get(column), errorHandler);
  }

  public static Cell convertToTextCell(Cell cell, ErrorHandler errorHandler) {
    if (cell == null) {
      return null;
    }
    invalidType(
        cell, Arrays.asList(CellType.STRING, CellType.BLANK, CellType.NUMERIC), errorHandler);
    if (cell.getCellType() == CellType.NUMERIC) {
      String numberAsString = DATA_FORMATTER.formatCellValue(cell).trim();
      cell.setCellValue(numberAsString);
    }
    return cell;
  }

  protected boolean cellAsFlag(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    return !isOptionalBlank(cell, true)
        && !invalidType(cell, CellType.STRING, errorHandler)
        && !invalidFlag(cell, errorHandler);
  }

  protected boolean cellAsBoolean(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String booleanString = cellAsString(cell, false, false, errorHandler);
    if (booleanString == null) {
      errorHandler.handleError(
          cell, "Ungültiger Wert (Erwartet: Ja, Nein, Tatsächlich: %s)".formatted(booleanString));
      return false;
    }

    return switch (booleanString.toUpperCase()) {
      case "JA" -> true;
      case "NEIN" -> false;
      default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: Ja, Nein, Tatsächlich: %s)".formatted(booleanString));
        yield false;
      }
    };
  }

  protected Boolean cellAsBooleanOrNull(
      ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String booleanString = cellAsString(cell, true, false, errorHandler);
    if (booleanString == null) {
      return null;
    }

    return switch (booleanString.toUpperCase()) {
      case "JA" -> true;
      case "NEIN" -> false;
      default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Ja, Nein oder leere Zelle. Tatsächlich: %s)"
                .formatted(booleanString));
        yield false;
      }
    };
  }

  protected Integer cellAsInt(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    if (invalidType(cell, CellType.NUMERIC, errorHandler)) {
      errorHandler.handleError(cell, "Ungültiger Wert");
      return null;
    }
    return (int) cell.getNumericCellValue();
  }

  protected Double cellAsDouble(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    if (invalidType(cell, CellType.NUMERIC, errorHandler)) {
      errorHandler.handleError(cell, "Ungültiger Wert");
      return null;
    }
    return cell.getNumericCellValue();
  }

  private static boolean isOptionalBlank(Cell cell, boolean optional) {
    return optional && isBlank(cell);
  }

  protected static boolean isBlank(Cell cell) {
    return cell == null || getNormalizedCellType(cell) == CellType.BLANK;
  }

  private static CellType getNormalizedCellType(Cell cell) {
    if (cell.getCellType() == CellType.STRING && cell.getStringCellValue().isBlank()) {
      return CellType.BLANK;
    }
    return cell.getCellType();
  }

  public static boolean isEmpty(Row row) {
    for (Cell cell : row) {
      if (!isBlank(cell)) {
        return false;
      }
    }
    return true;
  }

  protected LocalDate cellAsDate(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    return cellAsDate(col.get(column), errorHandler);
  }

  public static LocalDate cellAsDate(Cell cell, ErrorHandler errorHandler) {
    LocalDateTime localDateTime = cellAsDateTime(cell, errorHandler);
    return localDateTime != null ? localDateTime.toLocalDate() : null;
  }

  protected LocalDateTime cellAsDateTime(
      ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    return cellAsDateTime(col.get(column), errorHandler);
  }

  private static LocalDateTime cellAsDateTime(Cell cell, ErrorHandler errorHandler) {
    if (invalidType(cell, CellType.NUMERIC, errorHandler) || invalidDate(cell, errorHandler)) {
      return null;
    }
    return cell.getLocalDateTimeCellValue();
  }

  protected GenderDto cellAsGender(ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String gender = cellAsString(cell, true, false, errorHandler);
    if (gender == null) {
      return null;
    }

    return switch (gender.toUpperCase()) {
      case "M" -> GenderDto.MALE;
      case "W" -> GenderDto.FEMALE;
      case "D" -> GenderDto.DIVERSE;
      case "U", "" -> GenderDto.NOT_SPECIFIED;
      default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: M = Männlich, W = Weiblich, D = Divers, U = Unbekannt, Tatsächlich: %s)"
                .formatted(gender));
        yield null;
      }
    };
  }

  protected SalutationDto cellAsSalutation(
      ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String salutation = cellAsString(cell, true, false, errorHandler);
    if (salutation == null) {
      return null;
    }

    return switch (salutation) {
      case "Herr" -> SalutationDto.MALE;
      case "Frau" -> SalutationDto.FEMALE;
      case "Neutral" -> SalutationDto.NEUTRAL;
      case "Unbekannt", "" -> SalutationDto.NOT_SPECIFIED;
      default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Herr, Frau, Neutral, Unbekannt, Tatsächlich: %s)"
                .formatted(salutation));
        yield null;
      }
    };
  }

  protected CountryCode cellAsCountryCode(
      ColumnAccessor<C> col, C column, ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String countryCode = cellAsString(cell, true, false, errorHandler);
    if (countryCode == null) {
      return null;
    }
    try {
      return CountryCode.valueOf(countryCode);
    } catch (IllegalArgumentException exception) {
      errorHandler.handleError(
          cell,
          "Ungültiger Wert (Erwartet: Länderkürzel nach ISO 3166-1, Tatsächlich: %s)"
              .formatted(countryCode));
      return null;
    }
  }

  private static boolean invalidType(Cell cell, CellType expectedType, ErrorHandler errorHandler) {
    return invalidType(cell, List.of(expectedType), errorHandler);
  }

  private static boolean invalidType(
      Cell cell, List<CellType> expectedTypes, ErrorHandler errorHandler) {
    CellType actualType = getNormalizedCellType(cell);
    if (!expectedTypes.contains(actualType)) {
      String expectedType =
          String.format(
              expectedTypes.size() > 1 ? "[%s]" : "%s",
              String.join(",", expectedTypes.stream().map(Enum::name).toList()));
      String errorMessage =
          "Ungültiger Wert (Erwartet: %s, Tatsächlich: %s)".formatted(expectedType, actualType);
      errorHandler.handleError(cell, errorMessage);

      return true;
    }
    return false;
  }

  private static boolean invalidDate(Cell cell, ErrorHandler errorHandler) {
    if (cell.getLocalDateTimeCellValue() == null) {
      errorHandler.handleError(cell, "Ungültiges Datum");
      return true;
    }
    return false;
  }

  private static boolean invalidFlag(Cell cell, ErrorHandler errorHandler) {
    String cellValue = cellAsString(cell, errorHandler);
    if (cellValue != null
        && !cellValue.isBlank()
        && !Objects.equals(cellValue.toLowerCase(), "x")) {
      errorHandler.handleError(cell, "Ungültige Eingabe. Nur 'x' oder 'X' sind erlaubt.");
      return true;
    }
    return false;
  }

  private boolean anyValueInRange(
      ColumnAccessor<C> col, AddressColumns<C> addressColumns, ErrorHandler errorHandler) {
    return anyValueInRange(
        col.getRange(addressColumns.street(), addressColumns.addressAddition()), errorHandler);
  }

  protected static boolean anyValueInRange(Stream<Cell> range, ErrorHandler errorHandler) {
    return range
        .map(cell -> cellAsString(cell, true, false, errorHandler))
        .anyMatch(org.apache.commons.lang3.StringUtils::isNotBlank);
  }

  protected AddressData readAddressData(
      ColumnAccessor<C> col,
      AddressColumns<C> addressColumns,
      ErrorHandler errorHandler,
      boolean mandatoryAddress) {

    if (anyValueInRange(col, addressColumns, errorHandler) || mandatoryAddress) {
      String street = cellAsString(col, addressColumns.street(), false, false, errorHandler);
      String houseNumber =
          cellAsString(col, addressColumns.houseNumber(), true, true, errorHandler);
      String postalCode = cellAsString(col, addressColumns.postalCode(), false, true, errorHandler);
      String city = cellAsString(col, addressColumns.city(), false, false, errorHandler);
      String addressAddition =
          cellAsString(col, addressColumns.addressAddition(), true, true, errorHandler);
      return new AddressData(
          CountryCode.DE, city, postalCode, street, houseNumber, addressAddition);
    }
    return null;
  }

  public record AddressColumns<C extends XlsxColumn>(
      C street, C houseNumber, C postalCode, C city, C addressAddition) {}
}
