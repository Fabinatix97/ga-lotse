/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.*;
import org.springframework.util.StringUtils;

public abstract class RowProcessor<T extends RowValues>
    implements EqualityComparator<T>, RowValueMapper<T> {

  private static final DataFormatter DATA_FORMATTER = new DataFormatter();

  private final CellStyle errorCellStyle;
  private final Drawing<?> drawing;
  private final CreationHelper factory;
  private final ClientAnchor anchor;

  protected RowProcessor(Sheet sheet) {
    Workbook workbook = sheet.getWorkbook();

    errorCellStyle = createErrorStyle(workbook);
    drawing = sheet.createDrawingPatriarch();
    factory = workbook.getCreationHelper();
    anchor = factory.createClientAnchor();
  }

  public T processRow(Row row) {
    ColumnAccessor col = new ColumnAccessor(row);
    T result = process(col);
    result.setRow(row);

    return result;
  }

  protected abstract T process(ColumnAccessor col);

  protected ImportStatus processStatus(Cell cell, BiConsumer<Cell, String> errorHandler) {
    String status = cellAsString(cell, true, true, errorHandler);
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

  protected UUID processProcedureId(Cell cell, BiConsumer<Cell, String> errorHandler) {
    String uuid = cellAsString(cell, true, true, errorHandler);
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

  protected static String cellAsString(Cell cell, BiConsumer<Cell, String> errorHandler) {
    return cellAsString(cell, false, true, errorHandler);
  }

  protected static String cellAsString(
      Cell cell, boolean optional, boolean strict, BiConsumer<Cell, String> errorHandler) {
    List<CellType> expectedTypes =
        strict ? List.of(CellType.STRING) : List.of(CellType.STRING, CellType.NUMERIC);

    if (isOptionalBlank(cell, optional) || invalidType(cell, expectedTypes, errorHandler)) {
      return null;
    }

    if (strict) {
      return cell.getStringCellValue().trim();
    } else {
      return DATA_FORMATTER.formatCellValue(cell).trim();
    }
  }

  protected static boolean cellAsFlag(Cell cell, BiConsumer<Cell, String> errorHandler) {
    return !isOptionalBlank(cell, true)
        && !invalidType(cell, CellType.STRING, errorHandler)
        && !invalidFlag(cell, errorHandler);
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

  protected static LocalDate cellAsDate(Cell cell, BiConsumer<Cell, String> errorHandler) {
    if (invalidType(cell, CellType.NUMERIC, errorHandler) || invalidDate(cell, errorHandler)) {
      return null;
    }
    return cell.getLocalDateTimeCellValue().toLocalDate();
  }

  protected static GenderDto cellAsGender(Cell cell, BiConsumer<Cell, String> errorHandler) {
    String gender = cellAsString(cell, true, true, errorHandler);
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

  protected static SalutationDto cellAsSalutation(
      Cell cell, BiConsumer<Cell, String> errorHandler) {
    String salutation = cellAsString(cell, true, true, errorHandler);
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

  protected static CountryCodeDto cellAsCountryCode(
      Cell cell, BiConsumer<Cell, String> errorHandler) {
    String countryCode = cellAsString(cell, true, true, errorHandler);
    if (countryCode == null) {
      return null;
    }
    try {
      return CountryCodeDto.valueOf(countryCode);
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
}
