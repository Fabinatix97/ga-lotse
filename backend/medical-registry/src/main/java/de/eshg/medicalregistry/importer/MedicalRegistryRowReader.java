/*
 * Copyright 2024 cronn GmbH
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
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class MedicalRegistryRowReader
    extends RowReader<MedicalRegistryRowValues, MedicalRegistryColumn> {

  private static final ValidatorFactory validatorFactory =
      Validation.buildDefaultValidatorFactory();

  protected MedicalRegistryRowReader(Sheet sheet) {
    super(sheet, Arrays.asList(MedicalRegistryColumn.values()));
  }

  @Override
  protected MedicalRegistryRowValues read(ColumnAccessor<MedicalRegistryColumn> col) {
    MedicalRegistryRowValues result = new MedicalRegistryRowValues();
    result.setApplicant(createApplicantDto());
    result.setProfessionInformation(new CreateProfessionInformationDto());
    if (Arrays.stream(MedicalRegistryColumn.values())
        .filter(MedicalRegistryColumn::isPracticeRelated)
        .map(col::get)
        .anyMatch(not(RowReader::isBlank))) {
      result.setPractice(createPracticeDto());
    }
    MedicalRegistryErrorHandler errorHandler =
        new MedicalRegistryErrorHandler(result, this::addCellError);

    for (MedicalRegistryColumn column : MedicalRegistryColumn.values()) {
      switch (column) {
        case PROCEDURE_ID ->
            result.setProcedureId(readProcedureId(col, PROCEDURE_ID, errorHandler));
        case STATUS -> result.setStatus(readStatus(col, STATUS, errorHandler));
        default -> column.apply(result, col, errorHandler);
      }
    }
    return validate(result, col, errorHandler);
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

  private <R> R validate(
      R object,
      ColumnAccessor<MedicalRegistryColumn> col,
      MedicalRegistryErrorHandler errorHandler) {
    Set<ConstraintViolation<R>> constraintViolations =
        validatorFactory.getValidator().validate(object);
    for (ConstraintViolation<R> constraintViolation : constraintViolations) {
      MedicalRegistryColumn column =
          MedicalRegistryColumn.getColumn(constraintViolation.getPropertyPath());
      if (column != null) {
        errorHandler.handleError(col.get(column), describe(constraintViolation));
      } else {
        errorHandler.handleUnspecificError();
      }
    }
    return object;
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

  private class MedicalRegistryErrorHandler implements ErrorHandler {

    private final MedicalRegistryRowValues result;
    private final BiConsumer<Cell, String> cellSpecificErrorMessageConsumer;

    private MedicalRegistryErrorHandler(
        MedicalRegistryRowValues result,
        BiConsumer<Cell, String> cellSpecificErrorMessageConsumer) {
      this.result = result;
      this.cellSpecificErrorMessageConsumer = cellSpecificErrorMessageConsumer;
    }

    @Override
    public void handleError(Cell cell, String errorMessage) {
      result.foundInvalidData();
      cellSpecificErrorMessageConsumer.accept(cell, errorMessage);
    }

    public void handleUnspecificError() {
      result.foundInvalidData();
    }
  }
}
