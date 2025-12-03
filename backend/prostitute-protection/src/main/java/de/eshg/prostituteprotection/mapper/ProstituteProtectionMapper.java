/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.mapper;

import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.prostituteprotection.api.ConsultationDto;
import de.eshg.prostituteprotection.api.ConsultationTypeDto;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.DocumentTypeDto;
import de.eshg.prostituteprotection.api.LanguageDto;
import de.eshg.prostituteprotection.api.ProcedureDetailsDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureOverviewDto;
import de.eshg.prostituteprotection.api.UpdateEncryptedPersonalDataRequest;
import de.eshg.prostituteprotection.api.UpdateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.ConsultationType;
import de.eshg.prostituteprotection.domain.model.DocumentType;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import de.eshg.prostituteprotection.domain.model.Language;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.util.List;
import java.util.Objects;

public class ProstituteProtectionMapper {

  private ProstituteProtectionMapper() {}

  public static ProstituteProtectionProcedure mapRequestToDomain(
      CreateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        new ProstituteProtectionProcedure();

    prostituteProtectionProcedure.setConsultationType(
        mapConsultationType(request.consultationType()));

    return mapEncryptedPersonalData(prostituteProtectionProcedure, request);
  }

  private static ProstituteProtectionProcedure mapEncryptedPersonalData(
      ProstituteProtectionProcedure prostituteProtectionProcedure,
      CreateProstituteProtectionProcedureRequest request) {
    EncryptedPersonalData personalData = new EncryptedPersonalData();
    personalData.setAlias(request.alias());
    personalData.setLanguages(mapLanguages(request.languages()));

    prostituteProtectionProcedure.setEncryptedPersonalData(personalData);
    return prostituteProtectionProcedure;
  }

  public static ProstituteProtectionProcedure mapEncryptedPersonalData(
      ProstituteProtectionProcedure procedure, UpdateEncryptedPersonalDataRequest request) {
    procedure.getEncryptedPersonalData().setAlias(request.alias());
    procedure.getEncryptedPersonalData().setLastName(request.lastName());
    procedure.getEncryptedPersonalData().setFirstName(request.firstName());
    procedure.getEncryptedPersonalData().setDateOfBirth(request.dateOfBirth());
    procedure.getEncryptedPersonalData().setLanguages(mapLanguages(request.languages()));
    procedure.getEncryptedPersonalData().setDocumentType(mapDocumentType(request.documentType()));
    procedure.getEncryptedPersonalData().setNationality(request.nationality());
    return procedure;
  }

  public static ProcedureDetailsDto mapToDetailsDto(ProstituteProtectionProcedure procedure) {
    return new ProcedureDetailsDto(
        procedure.getExternalId(),
        procedure.getVersion(),
        procedure.getEncryptedPersonalData().getFirstName(),
        procedure.getEncryptedPersonalData().getLastName(),
        procedure.getEncryptedPersonalData().getDateOfBirth(),
        procedure.getEncryptedPersonalData().getAlias(),
        AppointmentMapper.toInterfaceType(
            procedure.getAppointment(), procedure.getUserDefinedAppointment()),
        mapToLanguagesDto(procedure.getEncryptedPersonalData().getLanguages()),
        mapToConsultationTypeDto(procedure.getConsultationType()),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        procedure.getEncryptedPersonalData().getNationality(),
        mapToDocumentTypeDto(procedure.getEncryptedPersonalData().getDocumentType()),
        procedure.getConsultationCertificateCreatedAt());
  }

  public static ConsultationDto mapConsultationToDto(Consultation consultation) {
    return new ConsultationDto(
        consultation.getVersion(),
        consultation.isLegalAdvices(),
        consultation.isHealthAndSocialInsurance(),
        consultation.isConsultingServices(),
        consultation.isEmergencyHelp(),
        consultation.isTaxLiability(),
        consultation.isClearing(),
        consultation.isInformationMaterial(),
        consultation.isPredicament(),
        consultation.isDiseasePrevention(),
        consultation.isBirthControl(),
        consultation.isPregnancy(),
        consultation.isAlcoholAndDrugUsage(),
        consultation.isReferral(),
        consultation.isSupervisedConsultation(),
        consultation.getRemark(),
        mapToLanguageDto(consultation.getLanguageOfConsultation()),
        consultation.isInterpreterConsulted(),
        consultation.getInterpreterFirstName(),
        consultation.getInterpreterLastName());
  }

  public static Consultation mapConsultationToDomain(ConsultationDto dto) {
    Consultation consultation = new Consultation();
    consultation.setLegalAdvices(dto.legalAdvices());
    consultation.setHealthAndSocialInsurance(dto.healthAndSocialInsurance());
    consultation.setConsultingServices(dto.consultingServices());
    consultation.setEmergencyHelp(dto.emergencyHelp());
    consultation.setTaxLiability(dto.taxLiability());
    consultation.setClearing(dto.clearing());
    consultation.setInformationMaterial(dto.informationMaterial());
    consultation.setPredicament(dto.predicament());
    consultation.setDiseasePrevention(dto.diseasePrevention());
    consultation.setBirthControl(dto.birthControl());
    consultation.setPregnancy(dto.pregnancy());
    consultation.setAlcoholAndDrugUsage(dto.alcoholAndDrugUsage());
    consultation.setReferral(dto.referral());
    consultation.setSupervisedConsultation(dto.supervisedConsultation());
    consultation.setRemark(dto.remark());
    consultation.setLanguageOfConsultation(mapLanguage(dto.languageOfConsultation()));
    consultation.setInterpreterConsulted(dto.interpreterConsulted());
    consultation.setInterpreterFirstName(dto.interpreterFirstName());
    consultation.setInterpreterLastName(dto.interpreterLastName());
    return consultation;
  }

  private static ConsultationType mapConsultationType(ConsultationTypeDto consultationTypeDto) {
    return switch (consultationTypeDto) {
      case null -> null;
      case ConsultationTypeDto.INITIAL -> ConsultationType.INITIAL;
      case ConsultationTypeDto.FOLLOW_UP -> ConsultationType.FOLLOW_UP;
    };
  }

  private static ConsultationTypeDto mapToConsultationTypeDto(ConsultationType consultationType) {
    return switch (consultationType) {
      case null -> null;
      case ConsultationType.INITIAL -> ConsultationTypeDto.INITIAL;
      case ConsultationType.FOLLOW_UP -> ConsultationTypeDto.FOLLOW_UP;
    };
  }

  private static DocumentTypeDto mapToDocumentTypeDto(DocumentType documentType) {
    return switch (documentType) {
      case null -> null;
      case DocumentType.IDENTIFICATION_CARD -> DocumentTypeDto.IDENTIFICATION_CARD;
      case DocumentType.PASSPORT -> DocumentTypeDto.PASSPORT;
    };
  }

  private static DocumentType mapDocumentType(DocumentTypeDto documentTypeDto) {
    return switch (documentTypeDto) {
      case null -> null;
      case DocumentTypeDto.IDENTIFICATION_CARD -> DocumentType.IDENTIFICATION_CARD;
      case DocumentTypeDto.PASSPORT -> DocumentType.PASSPORT;
    };
  }

  private static List<Language> mapLanguages(List<LanguageDto> languageDtos) {
    return languageDtos.stream()
        .map(ProstituteProtectionMapper::mapLanguage)
        .filter(Objects::nonNull)
        .toList();
  }

  private static Language mapLanguage(LanguageDto languageDto) {
    return switch (languageDto) {
      case null -> null;
      case LanguageDto.BULGARIAN -> Language.BULGARIAN;
      case LanguageDto.CHINESE -> Language.CHINESE;
      case LanguageDto.GERMAN -> Language.GERMAN;
      case LanguageDto.ENGLISH -> Language.ENGLISH;
      case LanguageDto.FRENCH -> Language.FRENCH;
      case LanguageDto.GREEK -> Language.GREEK;
      case LanguageDto.ITALIAN -> Language.ITALIAN;
      case LanguageDto.POLISH -> Language.POLISH;
      case LanguageDto.PORTUGUESE -> Language.PORTUGUESE;
      case LanguageDto.ROMANIAN -> Language.ROMANIAN;
      case LanguageDto.RUSSIAN -> Language.RUSSIAN;
      case LanguageDto.SERBO_CROATIAN -> Language.SERBO_CROATIAN;
      case LanguageDto.SLOVAKIAN -> Language.SLOVAKIAN;
      case LanguageDto.SPANISH -> Language.SPANISH;
      case LanguageDto.THAI -> Language.THAI;
      case LanguageDto.CZECH -> Language.CZECH;
      case LanguageDto.TURKISH -> Language.TURKISH;
      case LanguageDto.UKRAINIAN -> Language.UKRAINIAN;
      case LanguageDto.HUNGARIAN -> Language.HUNGARIAN;
      case LanguageDto.UNKNOWN -> Language.UNKNOWN;
    };
  }

  private static List<LanguageDto> mapToLanguagesDto(List<Language> languages) {
    return languages.stream()
        .map(ProstituteProtectionMapper::mapToLanguageDto)
        .filter(Objects::nonNull)
        .toList();
  }

  private static LanguageDto mapToLanguageDto(Language language) {
    return switch (language) {
      case null -> null;
      case Language.BULGARIAN -> LanguageDto.BULGARIAN;
      case Language.CHINESE -> LanguageDto.CHINESE;
      case Language.GERMAN -> LanguageDto.GERMAN;
      case Language.ENGLISH -> LanguageDto.ENGLISH;
      case Language.FRENCH -> LanguageDto.FRENCH;
      case Language.GREEK -> LanguageDto.GREEK;
      case Language.ITALIAN -> LanguageDto.ITALIAN;
      case Language.POLISH -> LanguageDto.POLISH;
      case Language.PORTUGUESE -> LanguageDto.PORTUGUESE;
      case Language.ROMANIAN -> LanguageDto.ROMANIAN;
      case Language.RUSSIAN -> LanguageDto.RUSSIAN;
      case Language.SERBO_CROATIAN -> LanguageDto.SERBO_CROATIAN;
      case Language.SLOVAKIAN -> LanguageDto.SLOVAKIAN;
      case Language.SPANISH -> LanguageDto.SPANISH;
      case Language.THAI -> LanguageDto.THAI;
      case Language.CZECH -> LanguageDto.CZECH;
      case Language.TURKISH -> LanguageDto.TURKISH;
      case Language.UKRAINIAN -> LanguageDto.UKRAINIAN;
      case Language.HUNGARIAN -> LanguageDto.HUNGARIAN;
      case Language.UNKNOWN -> LanguageDto.UNKNOWN;
    };
  }

  public static ProstituteProtectionProcedureOverviewDto mapProcedureToOverviewDto(
      ProstituteProtectionProcedure procedure) {
    return new ProstituteProtectionProcedureOverviewDto(
        procedure.getExternalId(),
        procedure.getEncryptedPersonalData().getFirstName(),
        procedure.getEncryptedPersonalData().getLastName(),
        procedure.getEncryptedPersonalData().getAlias(),
        procedure.getEncryptedPersonalData().getDateOfBirth(),
        mapLanguagesToInterfaceType(procedure),
        mapToConsultationTypeDto(procedure.getConsultationType()),
        procedure.getAppointmentStart(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        procedure.getCreatedAt(),
        procedure.getModifiedAt());
  }

  private static List<LanguageDto> mapLanguagesToInterfaceType(
      ProstituteProtectionProcedure procedure) {
    return procedure.getEncryptedPersonalData().getLanguages().stream()
        .map(ProstituteProtectionMapper::mapToLanguageDto)
        .toList();
  }

  public static void mapRequestToDomain(
      ProstituteProtectionProcedure procedure, UpdateProstituteProtectionProcedureRequest request) {
    procedure.setConsultationType(
        ProstituteProtectionMapper.mapConsultationType(request.consultationType()));
  }
}
