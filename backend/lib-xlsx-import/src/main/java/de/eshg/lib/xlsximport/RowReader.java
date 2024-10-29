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
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.*;
import org.springframework.util.StringUtils;

public abstract class RowReader<T extends RowValues, C extends XlsxColumn> {

  private static final DataFormatter DATA_FORMATTER = new DataFormatter();

  private final List<C> actualColumns;
  private final CellStyle errorCellStyle;
  private final Drawing<?> drawing;
  private final CreationHelper factory;
  private final ClientAnchor anchor;

  protected RowReader(Sheet sheet, List<C> actualColumns) {
    Workbook workbook = sheet.getWorkbook();

    this.actualColumns = actualColumns;
    errorCellStyle = createErrorStyle(workbook);
    drawing = sheet.createDrawingPatriarch();
    factory = workbook.getCreationHelper();
    anchor = factory.createClientAnchor();
  }

  public T readRow(Row row) {
    ColumnAccessor<C> col = new ColumnAccessor<>(row, actualColumns);
    T result = read(col);
    result.setRow(row);

    return result;
  }

  protected abstract T read(ColumnAccessor<C> col);

  protected ImportStatus readStatus(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    String status = cellAsString(cell, true, false, errorHandler);
    if (!StringUtils.hasLength(status)) {
      return null;
    }

    try {
      return ImportStatus.map(status);
    } catch (NoSuchElementException e) {
      errorHandler.accept(cell, "Ungültiger Wert");
      return null;
    }
  }

  protected UUID readProcedureId(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    String uuid = cellAsString(cell, true, false, errorHandler);
    if (!StringUtils.hasLength(uuid)) {
      return null;
    }

    try {
      return UUID.fromString(uuid);
    } catch (IllegalArgumentException e) {
      errorHandler.accept(cell, "Ungültiges Format");
      return null;
    }
  }

  protected BiConsumer<Cell, String> createErrorHandler(RowValues result) {
    return (cell, errorMessage) -> {
      result.foundInvalidData();
      addCellError(cell, errorMessage);
    };
  }

  protected void addCellError(Cell cell, String errorMessage) {
    cell.setCellStyle(errorCellStyle);
    cell.setCellComment(createComment(errorMessage));
  }

  private CellStyle createErrorStyle(Workbook workbook) {
    CellStyle errorStyle = workbook.createCellStyle();
    errorStyle.setFillForegroundColor(XlsxUtil.newColor(255, 215, 215));
    errorStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

    return errorStyle;
  }

  private Comment createComment(String errorMessage) {
    Comment comment = drawing.createCellComment(anchor);
    comment.setString(factory.createRichTextString(errorMessage));

    return comment;
  }

  protected String cellAsString(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    return cellAsString(col.get(column), errorHandler);
  }

  protected static String cellAsString(Cell cell, BiConsumer<Cell, String> errorHandler) {
    return cellAsString(cell, false, false, errorHandler);
  }

  protected String cellAsString(
      ColumnAccessor<C> col,
      C column,
      boolean optional,
      boolean allowCellTypeNumeric,
      BiConsumer<Cell, String> errorHandler) {
    return cellAsString(col.get(column), optional, allowCellTypeNumeric, errorHandler);
  }

  private static String cellAsString(
      Cell cell,
      boolean optional,
      boolean allowCellTypeNumeric,
      BiConsumer<Cell, String> errorHandler) {
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

  protected boolean cellAsFlag(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    return !isOptionalBlank(cell, true)
        && !invalidType(cell, CellType.STRING, errorHandler)
        && !invalidFlag(cell, errorHandler);
  }

  protected boolean cellAsBoolean(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    String booleanString = cellAsString(cell, false, false, errorHandler);
    if (booleanString == null) {
      errorHandler.accept(
          cell, "Ungültiger Wert (Erwartet: Ja, Nein, Tatsächlich: %s)".formatted(booleanString));
      return false;
    }

    return switch (booleanString.toUpperCase()) {
      case "JA" -> true;
      case "NEIN" -> false;
      default -> {
        errorHandler.accept(
            cell, "Ungültiger Wert (Erwartet: Ja, Nein, Tatsächlich: %s)".formatted(booleanString));
        yield false;
      }
    };
  }

  protected Boolean cellAsBooleanOrNull(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    String booleanString = cellAsString(cell, true, false, errorHandler);
    if (booleanString == null) {
      return null;
    }

    return switch (booleanString.toUpperCase()) {
      case "JA" -> true;
      case "NEIN" -> false;
      default -> {
        errorHandler.accept(
            cell,
            "Ungültiger Wert (Erwartet: Ja, Nein oder leere Zelle. Tatsächlich: %s)"
                .formatted(booleanString));
        yield false;
      }
    };
  }

  protected Integer cellAsInt(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    if (invalidType(cell, CellType.NUMERIC, errorHandler)) {
      errorHandler.accept(cell, "Ungültiger Wert");
      return null;
    }
    return (int) cell.getNumericCellValue();
  }

  private static boolean isOptionalBlank(Cell cell, boolean optional) {
    return optional && (cell == null || getNormalizedCellType(cell) == CellType.BLANK);
  }

  private static CellType getNormalizedCellType(Cell cell) {
    if (cell.getCellType() == CellType.STRING && cell.getStringCellValue().isBlank()) {
      return CellType.BLANK;
    }
    return cell.getCellType();
  }

  protected LocalDate cellAsDate(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    if (invalidType(cell, CellType.NUMERIC, errorHandler) || invalidDate(cell, errorHandler)) {
      return null;
    }
    return cell.getLocalDateTimeCellValue().toLocalDate();
  }

  protected GenderDto cellAsGender(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
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
        errorHandler.accept(
            cell,
            "Ungültiger Wert (Erwartet: M = Männlich, W = Weiblich, D = Divers, U = Unbekannt, Tatsächlich: %s)"
                .formatted(gender));
        yield null;
      }
    };
  }

  protected SalutationDto cellAsSalutation(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
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
        errorHandler.accept(
            cell,
            "Ungültiger Wert (Erwartet: Herr, Frau, Neutral, Unbekannt, Tatsächlich: %s)"
                .formatted(salutation));
        yield null;
      }
    };
  }

  protected CountryCode cellAsCountryCode(
      ColumnAccessor<C> col, C column, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    String countryCode = cellAsString(cell, true, false, errorHandler);
    if (countryCode == null) {
      return null;
    }
    try {
      return CountryCode.valueOf(countryCode);
    } catch (IllegalArgumentException exception) {
      errorHandler.accept(
          cell,
          "Ungültiger Wert (Erwartet: Länderkürzel nach ISO 3166-1, Tatsächlich: %s)"
              .formatted(countryCode));
      return null;
    }
  }

  private static boolean invalidType(
      Cell cell, CellType expectedType, BiConsumer<Cell, String> errorHandler) {
    return invalidType(cell, List.of(expectedType), errorHandler);
  }

  private static boolean invalidType(
      Cell cell, List<CellType> expectedTypes, BiConsumer<Cell, String> errorHandler) {
    CellType actualType = getNormalizedCellType(cell);
    if (!expectedTypes.contains(actualType)) {
      String expectedType =
          String.format(
              expectedTypes.size() > 1 ? "[%s]" : "%s",
              String.join(",", expectedTypes.stream().map(Enum::name).toList()));
      String errorMessage =
          "Ungültiger Wert (Erwartet: %s, Tatsächlich: %s)".formatted(expectedType, actualType);
      errorHandler.accept(cell, errorMessage);

      return true;
    }
    return false;
  }

  private static boolean invalidDate(Cell cell, BiConsumer<Cell, String> errorHandler) {
    if (cell.getLocalDateTimeCellValue() == null) {
      errorHandler.accept(cell, "Ungültiges Datum");
      return true;
    }
    return false;
  }

  private static boolean invalidFlag(Cell cell, BiConsumer<Cell, String> errorHandler) {
    String cellValue = cellAsString(cell, errorHandler);
    if (cellValue != null
        && !cellValue.isBlank()
        && !Objects.equals(cellValue.toLowerCase(), "x")) {
      errorHandler.accept(cell, "Ungültige Eingabe. Nur 'x' oder 'X' sind erlaubt.");
      return true;
    }
    return false;
  }

  private boolean anyValueInRange(
      ColumnAccessor<C> col,
      AddressColumns<C> addressColumns,
      BiConsumer<Cell, String> errorHandler) {
    return anyValueInRange(
        col.getRange(addressColumns.street(), addressColumns.addressAddition()), errorHandler);
  }

  protected static boolean anyValueInRange(
      Stream<Cell> range, BiConsumer<Cell, String> errorHandler) {
    return range
        .map(cell -> cellAsString(cell, true, false, errorHandler))
        .anyMatch(org.apache.commons.lang3.StringUtils::isNotBlank);
  }

  protected AddressData readAddressData(
      ColumnAccessor<C> col,
      AddressColumns<C> addressColumns,
      BiConsumer<Cell, String> errorHandler,
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
