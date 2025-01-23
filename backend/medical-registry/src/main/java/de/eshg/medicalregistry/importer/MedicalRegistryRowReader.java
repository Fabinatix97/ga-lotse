/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.importer;

import static de.eshg.medicalregistry.importer.MedicalRegistryColumn.PROCEDURE_ID;
import static de.eshg.medicalregistry.importer.MedicalRegistryColumn.STATUS;
import static java.util.function.Predicate.not;

import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.medicalregistry.api.ApplicantAddressDto;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProfessionInformationDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.metadata.ConstraintDescriptor;
import java.util.Arrays;
import java.util.Set;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

class MedicalRegistryRowReader extends RowReader<MedicalRegistryRow, MedicalRegistryColumn> {

  private static final ValidatorFactory validatorFactory =
      Validation.buildDefaultValidatorFactory();

  MedicalRegistryRowReader(Sheet sheet) {
    super(sheet, Arrays.asList(MedicalRegistryColumn.values()), MedicalRegistryRow::new);
  }

  @Override
  protected void read(
      MedicalRegistryRow result,
      ColumnAccessor<MedicalRegistryColumn> col,
      ErrorHandler errorHandler) {
    result.setApplicant(createApplicantDto());
    result.setProfessionInformation(new CreateProfessionInformationDto());
    if (Arrays.stream(MedicalRegistryColumn.values())
        .filter(MedicalRegistryColumn::isPracticeRelated)
        .map(col::get)
        .anyMatch(not(RowReader::isBlank))) {
      result.setPractice(createPracticeDto());
    }

    for (MedicalRegistryColumn column : MedicalRegistryColumn.values()) {
      switch (column) {
        case PROCEDURE_ID -> result.setEntityId(readUuid(col, PROCEDURE_ID, errorHandler));
        case STATUS -> result.setStatus(readStatus(col, STATUS, errorHandler));
        default -> column.apply(result, col, errorHandler);
      }
    }
    validate(result, col, errorHandler);
  }

  private CreateApplicantDto createApplicantDto() {
    CreateApplicantDto result = new CreateApplicantDto();
    result.setAddress(new ApplicantAddressDto());
    return result;
  }

  private CreatePracticeDto createPracticeDto() {
    CreatePracticeDto result = new CreatePracticeDto();
    result.setAddress(new PracticeAddressDto());
    return result;
  }

  private void validate(
      MedicalRegistryRow row,
      ColumnAccessor<MedicalRegistryColumn> col,
      ErrorHandler errorHandler) {
    Set<ConstraintViolation<MedicalRegistryRow>> constraintViolations =
        validatorFactory.getValidator().validate(row);
    for (ConstraintViolation<MedicalRegistryRow> constraintViolation : constraintViolations) {
      MedicalRegistryColumn column =
          MedicalRegistryColumn.getColumn(constraintViolation.getPropertyPath());
      if (column != null) {
        errorHandler.handleError(col.get(column), describe(constraintViolation));
      } else {
        row.markAsInvalid();
      }
    }
  }

  private String describe(ConstraintViolation<?> constraintViolation) {
    ConstraintDescriptor<?> constraintDescriptor = constraintViolation.getConstraintDescriptor();
    return switch (constraintDescriptor.getAnnotation()) {
      case Size size ->
          "Darf nicht kürzer als "
              + constraintDescriptor.getAttributes().get("min")
              + " Zeichen und nicht länger als "
              + constraintDescriptor.getAttributes().get("max")
              + " Zeichen sein";
      case Pattern pattern ->
          "Muss folgendem regulären Ausdruck genügen: "
              + constraintDescriptor.getAttributes().get("regexp");
      case NotNull notNull -> "Feld darf nicht leer sein";
      default -> constraintViolation.getMessage();
    };
  }

  public static String convertCellAndGetString(Cell cell, ErrorHandler errorHandler) {
    return cellAsString(convertToTextCell(cell, errorHandler), true, false, errorHandler);
  }
}
