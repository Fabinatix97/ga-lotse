/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.importer;

import static de.eshg.lib.xlsximport.RowReader.cellAsDate;
import static de.eshg.medicalregistry.importer.Constants.STRING_REPRESENTATION_FALSE;
import static de.eshg.medicalregistry.importer.Constants.STRING_REPRESENTATION_TRUE;
import static de.eshg.medicalregistry.importer.MedicalRegistryRowReader.convertCellAndGetString;

import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.medicalregistry.api.ApplicantAddressDto;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProfessionInformationDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;
import jakarta.validation.Path;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;

public enum MedicalRegistryColumn implements XlsxColumn {
  TITLE(
      "Titel",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getTitle)),
  LAST_NAME(
      "Nachname",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getLastName)),
  FIRST_NAME(
      "Vorname",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getFirstName)),
  NAME_AT_BIRTH(
      "Geburtsname",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getNameAtBirth)),
  STREET(
      "Straße",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getAddress,
          ApplicantAddressDto.class,
          ApplicantAddressDto::getStreet)),
  NUMBER(
      "Hausnummer",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getAddress,
          ApplicantAddressDto.class,
          ApplicantAddressDto::getHouseNumber)),
  POSTAL_CODE(
      "PLZ",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getAddress,
          ApplicantAddressDto.class,
          ApplicantAddressDto::getPostalCode)),
  CITY(
      "Ort",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getAddress,
          ApplicantAddressDto.class,
          ApplicantAddressDto::getCity)),
  COUNTRY(
      "Land",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getAddress,
          ApplicantAddressDto.class,
          ApplicantAddressDto::getCountry)),
  DATE_OF_BIRTH(
      "Geburtsdatum",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getDateOfBirth)),
  PLACE_OF_BIRTH(
      "Geburtsort",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getPlaceOfBirth)),
  NATIONALITY(
      "Staatsangehörigkeit",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getNationality)),
  PHONE(
      "Telefon",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getPhoneNumber)),
  EMAIL(
      "E-Mail",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getEmailAddress)),
  GENDER(
      "Geschlecht",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getApplicant,
          CreateApplicantDto.class,
          CreateApplicantDto::getGender)),
  PROFESSIONAL_TITLE(
      "Berufsbezeichnung",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getProfessionalTitle)),
  FIELD_OF_EXPERTISE(
      "Fachgebiet",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getFieldOfExpertise)),
  SPECIALIST_TITLE(
      "Facharztbezeichnung",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getSpecialistTitle)),
  FURTHER_TRAINING(
      "Weiterbildung",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getFurtherTraining)),
  QUALIFICATIONS(
      "Qualifizierung",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getQualifications)),
  LIFETIME_DOCTOR_NUMBER(
      "Lebenslange Arztnummer (LAN)",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getLifetimeDoctorNumber)),
  APPROBATION_GRANTED_ON(
      "Erlaubnis / Approbation: Datum",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getApprobationGrantedOn)),
  APPROBATION_ISSUING_AUTHORITY(
      "Erlaubnis / Approbation: Ausstellungsbehörde",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getApprobationIssuingAuthority)),
  EMPLOYMENT_TYPE(
      "Beschäftigungsart",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getEmploymentType)),
  EMPLOYMENT_STATUS(
      "Beschäftigungsstatus",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getProfessionInformation,
          CreateProfessionInformationDto.class,
          CreateProfessionInformationDto::getEmploymentStatus)),
  PRACTICE_NAME(
      "Praxis: Name",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getName)),
  PRACTICE_STREET(
      "Praxis: Straße",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getAddress,
          PracticeAddressDto.class,
          PracticeAddressDto::getStreet)),
  PRACTICE_HOUSE_NUMBER(
      "Praxis: Hausnummer",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getAddress,
          PracticeAddressDto.class,
          PracticeAddressDto::getHouseNumber)),
  PRACTICE_POSTAL_CODE(
      "Praxis: PLZ",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getAddress,
          PracticeAddressDto.class,
          PracticeAddressDto::getPostalCode)),
  PRACTICE_CITY(
      "Praxis: Ort",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getAddress,
          PracticeAddressDto.class,
          PracticeAddressDto::getCity)),
  PRACTICE_PHONE(
      "Praxis: Telefon",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getPhoneNumber)),
  PRACTICE_EMAIL(
      "Praxis: E-Mail",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getEmailAddress)),
  PRACTICE_WEBSITE(
      "Webseite",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getWebsite)),
  PRACTICE_OPENING_HOURS(
      "Öffnungszeiten",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getOpeningHours)),
  INSTITUTION_IDENTIFIER(
      "Institutionskennzeichen (IK)",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getInstitutionIdentifier)),
  ESTABLISHMENT_NUMBER(
      "Betriebsstättennummer (BSNR)",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getEstablishmentNumber)),
  HEALTH_INSURANCE_AUTHORIZATION(
      "Kassenzulassung",
      Mapping.of(
          MedicalRegistryRow.class,
          MedicalRegistryRow::getPractice,
          CreatePracticeDto.class,
          CreatePracticeDto::getHealthInsuranceAuthorization)),
  STATUS(STATUS_COLUMN_HEADER, Necessity.ADD_IF_MISSING, STATUS_COLUMN_HEADER_WIDTH),
  PROCEDURE_ID(PROCEDURE_COLUMN_HEADER, Necessity.ADD_IF_MISSING, UUID_COLUMN_WIDTH);

  private final String header;
  private final Necessity necessity;
  private final int columnWidth;
  private final Mapping<MedicalRegistryRow> mapping;

  private static final int DEFAULT_COLUMN_WIDTH = 0;

  MedicalRegistryColumn(String header, Mapping<MedicalRegistryRow> mapping) {
    this(header, Necessity.REQUIRED, DEFAULT_COLUMN_WIDTH, mapping);
  }

  MedicalRegistryColumn(String header, Necessity necessity, int columnWidth) {
    this(header, necessity, columnWidth, null);
  }

  MedicalRegistryColumn(
      String header, Necessity necessity, int columnWidth, Mapping<MedicalRegistryRow> mapping) {
    this.header = header;
    this.necessity = necessity;
    this.columnWidth = columnWidth;
    this.mapping = mapping;
  }

  @Override
  public String getHeader() {
    return header;
  }

  @Override
  public Necessity getNecessity() {
    return necessity;
  }

  @Override
  public int getColumnWidth() {
    return columnWidth;
  }

  public boolean isDateColumn() {
    return mapping != null && mapping.getFieldClass() == LocalDate.class;
  }

  public boolean isBooleanColumn() {
    return mapping != null && mapping.getFieldClass() == Boolean.class;
  }

  public Set<String> getPossibleValues() {
    if (mapping != null) {
      return getEnumConstants(mapping.getFieldClass())
          .map(Enum::name)
          .collect(Collectors.toCollection(LinkedHashSet::new));
    } else {
      return Collections.emptySet();
    }
  }

  public Mapping<MedicalRegistryRow> getMapping() {
    return mapping;
  }

  public static MedicalRegistryColumn getColumn(Path path) {
    return Arrays.stream(values())
        .filter(column -> path.equals(column.mapping.getPropertyPath()))
        .findFirst()
        .orElse(null);
  }

  public boolean isPracticeRelated() {
    return mapping != null && mapping.containsClass(CreatePracticeDto.class);
  }

  public void apply(
      MedicalRegistryRow rootDto,
      ColumnAccessor<MedicalRegistryColumn> columnAccessor,
      ErrorHandler errorHandler) {
    Object columnContent = readColumnContent(columnAccessor, errorHandler);
    if (columnContent != null) {
      mapping.write(rootDto, columnContent);
    }
  }

  private Object readColumnContent(
      ColumnAccessor<MedicalRegistryColumn> columnAccessor, ErrorHandler errorHandler) {

    Class<?> type = mapping.getFieldClass();

    if (String.class == type) {
      return convertCellAndGetString(columnAccessor.get(this), errorHandler);
    } else if (LocalDate.class == type) {
      return cellAsDate(columnAccessor.get(this), errorHandler);
    } else if (Boolean.class == type) {
      return getBoolean(
          convertCellAndGetString(columnAccessor.get(this), errorHandler),
          errorHandlerForColumn(errorHandler, columnAccessor, this));
    } else if (Enum.class.isAssignableFrom(type)) {
      return getEnumConstant(
          type,
          convertCellAndGetString(columnAccessor.get(this), errorHandler),
          errorHandlerForColumn(errorHandler, columnAccessor, this));
    } else {
      return null;
    }
  }

  private Object getEnumConstant(Class<?> enumClass, String name, Consumer<String> errorConsumer) {
    if (StringUtils.isBlank(name)) {
      return null;
    }
    Optional<? extends Enum<?>> enumConstant =
        getEnumConstants(enumClass).filter(e -> e.name().equals(name)).findFirst();
    if (enumConstant.isPresent()) {
      return enumConstant.get();
    } else {
      errorConsumer.accept(
          "Unbekannte Enum-Konstante "
              + name
              + " (Erlaubt: "
              + getEnumConstants(enumClass).map(Enum::name).collect(Collectors.joining(","))
              + ")");
      return null;
    }
  }

  private static Stream<Enum<?>> getEnumConstants(Class<?> enumClass) {
    return (enumClass.getEnumConstants() == null)
        ? Stream.empty()
        : Arrays.stream(enumClass.getEnumConstants()).map(e -> (Enum<?>) e);
  }

  private Boolean getBoolean(String name, Consumer<String> errorConsumer) {
    if (StringUtils.isBlank(name)) {
      return null;
    }
    return switch (name) {
      case STRING_REPRESENTATION_FALSE -> Boolean.FALSE;
      case STRING_REPRESENTATION_TRUE -> Boolean.TRUE;
      default -> {
        errorConsumer.accept(
            "Unbekannte Enum-Konstante "
                + name
                + " (Erlaubt: "
                + STRING_REPRESENTATION_TRUE
                + ","
                + STRING_REPRESENTATION_FALSE
                + ")");
        yield null;
      }
    };
  }

  private Consumer<String> errorHandlerForColumn(
      ErrorHandler errorHandler,
      ColumnAccessor<MedicalRegistryColumn> col,
      MedicalRegistryColumn column) {
    return (errorMessage) -> errorHandler.handleError(col.get(column), errorMessage);
  }
}
