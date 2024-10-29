/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.PastProcedureListColumn.ADDRESS_ADDITION;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.BIRTH_WEIGHT;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.CHILD_LANGUAGE_SCREENING;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.CITY;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.COUNTRY_OF_BIRTH_P1;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.COUNTRY_OF_BIRTH_P2;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.DATE_OF_BIRTH;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.DAYCARE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.DIPHTERIA;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.EARLY_SUPPORT;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.ERGO_THERAPY;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.EXAMINATION_DATE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.FIRST_NAME;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.GENDER;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.HEPATITIS_A;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.HEPATITIS_B;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.HIB;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.HOUSE_NUMBER;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.INTEGRATION_PLACE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.LAST_NAME;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.MENINGOCOCCUS_B;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.MENINGOCOCCUS_C;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.MIGRATION_BACKGROUND;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.MMR;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.NATIONALITY_CHILD;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.NATIONALITY_P1;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.NATIONALITY_P2;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PERKOMBI_HBV;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PERTUSSIS;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PHYSIO_THERAPY;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PNEUMOCOCCUS;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.POLIO;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.POSTAL_CODE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PRELIMINARY_COURSE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PROCEDURE_ID;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.PROCEDURE_TYPE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.ROTA;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.SIBLINGS;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.SPEECH_THERAPY;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.STATUS;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.STREET;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.TBE;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.TETANUS;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U2;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U3;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U4;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U5;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U6;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U7;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U7A;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U8;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.U9;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.VACCINATION_SCHEME;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.VARICELLA;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.business.model.ImportAnamnesisData;
import de.eshg.schoolentry.business.model.ImportChildData;
import de.eshg.schoolentry.business.model.ImportVaccinationStatusData;
import java.util.List;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.data.domain.Range;

public class PastProcedureListRowReader
    extends RowReader<PastProcedureListRowValues, PastProcedureListColumn> {

  public PastProcedureListRowReader(Sheet sheet, List<PastProcedureListColumn> actualColumns) {
    super(sheet, actualColumns);
  }

  @Override
  protected PastProcedureListRowValues read(ColumnAccessor<PastProcedureListColumn> col) {
    PastProcedureListRowValues result = new PastProcedureListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(readChildData(col, errorHandler));
    result.setProcedureType(readProcedureType(col, errorHandler));
    result.setExaminationDate(cellAsDate(col, EXAMINATION_DATE, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setProcedureId(readProcedureId(col, PROCEDURE_ID, errorHandler));
    result.setAnamnesisData(readAnamnesisData(col, errorHandler));
    result.setVaccinationStatusData(readVaccinationStatusData(col, errorHandler));
    return result;
  }

  private ImportAnamnesisData readAnamnesisData(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportAnamnesisData(
        cellAsInt(col, SIBLINGS, errorHandler),
        cellAsInt(col, NATIONALITY_CHILD, errorHandler),
        cellAsInt(col, NATIONALITY_P1, errorHandler),
        cellAsInt(col, COUNTRY_OF_BIRTH_P1, errorHandler),
        cellAsInt(col, NATIONALITY_P2, errorHandler),
        cellAsInt(col, COUNTRY_OF_BIRTH_P2, errorHandler),
        cellAsBoolean(col, MIGRATION_BACKGROUND, errorHandler),
        cellAsInt(col, DAYCARE, errorHandler),
        cellAsBooleanWithFallbackFalse(col, PRELIMINARY_COURSE, errorHandler),
        readBirthWeight(col, errorHandler),
        cellAsBooleanWithFallbackFalse(col, INTEGRATION_PLACE, errorHandler),
        cellAsBooleanWithFallbackFalse(col, EARLY_SUPPORT, errorHandler),
        cellAsBooleanWithFallbackFalse(col, ERGO_THERAPY, errorHandler),
        cellAsBooleanWithFallbackFalse(col, SPEECH_THERAPY, errorHandler),
        cellAsBooleanWithFallbackFalse(col, PHYSIO_THERAPY, errorHandler),
        cellAsBooleanWithFallbackFalse(col, CHILD_LANGUAGE_SCREENING, errorHandler),
        cellAsBooleanOrNull(col, U2, errorHandler),
        cellAsBooleanOrNull(col, U3, errorHandler),
        cellAsBooleanOrNull(col, U4, errorHandler),
        cellAsBooleanOrNull(col, U5, errorHandler),
        cellAsBooleanOrNull(col, U6, errorHandler),
        cellAsBooleanOrNull(col, U7, errorHandler),
        cellAsBooleanOrNull(col, U7A, errorHandler),
        cellAsBooleanOrNull(col, U8, errorHandler),
        cellAsBooleanOrNull(col, U9, errorHandler));
  }

  private ImportVaccinationStatusData readVaccinationStatusData(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportVaccinationStatusData(
        readVaccinationScheme(col, errorHandler),
        readNumberOfVaccinations(col, TETANUS, errorHandler),
        readNumberOfVaccinations(col, DIPHTERIA, errorHandler),
        readNumberOfVaccinations(col, PERTUSSIS, errorHandler),
        readNumberOfVaccinations(col, POLIO, errorHandler),
        readNumberOfVaccinations(col, HIB, errorHandler),
        readNumberOfVaccinations(col, HEPATITIS_B, errorHandler),
        readNumberOfVaccinations(col, MMR, errorHandler),
        readNumberOfVaccinations(col, VARICELLA, errorHandler),
        readNumberOfVaccinations(col, MENINGOCOCCUS_C, errorHandler),
        readNumberOfVaccinations(col, PNEUMOCOCCUS, errorHandler),
        readNumberOfVaccinations(col, HEPATITIS_A, errorHandler),
        readNumberOfVaccinations(col, TBE, errorHandler),
        readNumberOfVaccinations(col, ROTA, errorHandler),
        readNumberOfVaccinations(col, MENINGOCOCCUS_B, errorHandler),
        cellAsBooleanOrNull(col, PERKOMBI_HBV, errorHandler));
  }

  private ImportChildData readChildData(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        readAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            false),
        null);
  }

  private ProcedureType readProcedureType(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(PROCEDURE_TYPE);
    String string = cellAsString(cell, errorHandler);

    return switch (string) {
      case "Regel" -> ProcedureType.REGULAR_EXAMINATION;
      case "Kann" -> ProcedureType.CAN_CHILD;
      case "Eingangsstufe" -> ProcedureType.ENTRY_LEVEL;
      default -> {
        errorHandler.accept(cell, "Ungültiger Wert");
        yield null;
      }
    };
  }

  private int readBirthWeight(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(BIRTH_WEIGHT);
    Integer value = cellAsInt(col, BIRTH_WEIGHT, errorHandler);
    Range<Integer> validRange = Range.closed(300, 6000);
    if (!validRange.contains(value) && !value.equals(9999)) {
      errorHandler.accept(
          cell,
          "Ungültiger Wert (Erwartet: Wert zwischen 300 und 6000 sowie 9999. Tatsächlich: %s)"
              .formatted(value));
    }
    return value;
  }

  private boolean cellAsBooleanWithFallbackFalse(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      BiConsumer<Cell, String> errorHandler) {
    Boolean value = cellAsBooleanOrNull(col, column, errorHandler);
    if (value == null) {
      return false;
    }
    return value;
  }

  private int readVaccinationScheme(
      ColumnAccessor<PastProcedureListColumn> col, BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(VACCINATION_SCHEME);
    Integer value = cellAsInt(col, VACCINATION_SCHEME, errorHandler);
    return switch (value) {
      case 2, 3, 9 -> value;
      case null, default -> {
        errorHandler.accept(
            cell, "Ungültiger Wert (Erwartet: 2, 3 oder 9. Tatsächlich: %s)".formatted(value));
        yield value;
      }
    };
  }

  private int readNumberOfVaccinations(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      BiConsumer<Cell, String> errorHandler) {
    Cell cell = col.get(column);
    Integer value = cellAsInt(col, column, errorHandler);
    Range<Integer> validRange = Range.closed(0, 9);
    if (!validRange.contains(value)) {
      errorHandler.accept(
          cell,
          "Ungültiger Wert (Erwartet: Wert zwischen 0 und 9. Tatsächlich: %s)".formatted(value));
    }
    return value;
  }
}
