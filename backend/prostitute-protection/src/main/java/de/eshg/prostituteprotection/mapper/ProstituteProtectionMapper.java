/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.mapper;

import static de.eshg.prostituteprotection.mapper.WaitingRoomMapper.mapWaitingRoomToDto;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.prostituteprotection.api.ConsultationDto;
import de.eshg.prostituteprotection.api.ConsultationParagraph10Dto;
import de.eshg.prostituteprotection.api.ConsultationParagraph7Dto;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.DocumentTypeDto;
import de.eshg.prostituteprotection.api.EncryptedFileOverviewDto;
import de.eshg.prostituteprotection.api.LanguageDto;
import de.eshg.prostituteprotection.api.ProcedureDetailsDto;
import de.eshg.prostituteprotection.api.ProcedureTypeDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureOverviewDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchOverviewDto;
import de.eshg.prostituteprotection.api.UpdateEncryptedPersonalDataRequest;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.crypto.EncryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.data.ProstituteProtectionProcedureWithAugmentedData;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.DocumentType;
import de.eshg.prostituteprotection.domain.model.EncryptedFile;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import de.eshg.prostituteprotection.domain.model.Language;
import de.eshg.prostituteprotection.domain.model.PersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.util.List;
import java.util.Objects;

public class ProstituteProtectionMapper {

  private ProstituteProtectionMapper() {}

  public static ProstituteProtectionProcedure mapRequestToDomain(
      CreateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        new ProstituteProtectionProcedure();

    prostituteProtectionProcedure.setProcedureType(mapProcedureType(request.procedureType()));

    return mapPersonalData(prostituteProtectionProcedure, request);
  }

  public static ProcedureType mapProcedureType(ProcedureTypeDto procedureType) {
    return switch (procedureType) {
      case INITIAL -> ProcedureType.PROSTITUTE_PROTECTION_INITIAL;
      case FOLLOW_UP -> ProcedureType.PROSTITUTE_PROTECTION_FOLLOW_UP;
    };
  }

  public static ProcedureTypeDto mapProcedureTypeToDto(ProcedureType procedureType) {
    return switch (procedureType) {
      case PROSTITUTE_PROTECTION_INITIAL -> ProcedureTypeDto.INITIAL;
      case PROSTITUTE_PROTECTION_FOLLOW_UP -> ProcedureTypeDto.FOLLOW_UP;
      default ->
          throw new IllegalStateException(
              "Invalid procedure type for prostitute-protection: %s".formatted(procedureType));
    };
  }

  private static ProstituteProtectionProcedure mapPersonalData(
      ProstituteProtectionProcedure prostituteProtectionProcedure,
      CreateProstituteProtectionProcedureRequest request) {
    PersonalData personalData = new PersonalData();
    personalData.setAlias(request.alias());
    personalData.setPhoneNumber(request.phoneNumber());
    personalData.setLanguages(mapLanguages(request.languages()));

    prostituteProtectionProcedure.setPersonalData(personalData);
    return prostituteProtectionProcedure;
  }

  public static ProstituteProtectionProcedure mapPersonalData(
      ProstituteProtectionProcedure procedure,
      UpdateEncryptedPersonalDataRequest request,
      EncryptedPersonalDataDto encryptedPersonalDataDto) {
    PersonalData personalData = procedure.getPersonalData();
    personalData.setAlias(request.alias());
    personalData.setPhoneNumber(null);
    personalData.setLanguages(mapLanguages(request.languages()));
    personalData.setDocumentType(mapDocumentType(request.documentType()));
    personalData.setResidencePermitValidityDate(request.residencePermitValidityDate());
    personalData.setCustomDocumentType(request.customDocumentType());

    EncryptedPersonalData encryptedPersonalData = procedure.getEncryptedPersonalData();
    encryptedPersonalData.setEncryptedData(encryptedPersonalDataDto.data());
    encryptedPersonalData.setHashedPersonIdentifier(
        encryptedPersonalDataDto.hashedPersonIdentifier());
    encryptedPersonalData.setNonce(encryptedPersonalDataDto.nonce());
    return procedure;
  }

  public static ProcedureDetailsDto mapToDetailsDto(
      ProstituteProtectionProcedureWithAugmentedData procedureWithAugmentedData) {
    ProstituteProtectionProcedure procedure = procedureWithAugmentedData.procedure();
    EncryptedPersonalData encryptedPersonalData = procedure.getEncryptedPersonalData();
    PersonalData personalData = procedure.getPersonalData();
    return new ProcedureDetailsDto(
        procedure.getExternalId(),
        procedure.getVersion(),
        personalData.getAlias(),
        personalData.getPhoneNumber(),
        AppointmentMapper.toInterfaceType(
            procedure.getAppointment(), procedure.getUserDefinedAppointment()),
        procedure.getAppointment() != null,
        mapToLanguagesDto(personalData.getLanguages()),
        mapProcedureTypeToDto(procedure.getProcedureType()),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        mapToDocumentTypeDto(personalData.getDocumentType()),
        procedure.getConsultationCertificateCreatedAt(),
        encryptedPersonalData != null && encryptedPersonalData.getHashedPersonIdentifier() != null,
        procedureWithAugmentedData.consultant(),
        procedureWithAugmentedData.creator(),
        mapWaitingRoomToDto(procedure.getWaitingRoom()),
        personalData.getResidencePermitValidityDate(),
        personalData.getCustomDocumentType());
  }

  public static ConsultationDto mapConsultationToDto(Consultation consultation) {
    return new ConsultationDto(
        consultation.getVersion(),
        new ConsultationParagraph7Dto(
            consultation.isLegalAdvices(),
            consultation.isHealthAndSocialInsurance(),
            consultation.isConsultingServices(),
            consultation.isEmergencyHelp(),
            consultation.isTaxLiability(),
            consultation.isInformationMaterial(),
            consultation.isPredicament()),
        new ConsultationParagraph10Dto(
            consultation.isDiseasePrevention(),
            consultation.isBirthControl(),
            consultation.isPregnancy(),
            consultation.isAlcoholAndDrugUsage(),
            consultation.isReferral(),
            consultation.isClearing()),
        mapToLanguageDto(consultation.getLanguageOfConsultation()),
        consultation.isInterpreterConsulted(),
        consultation.getInterpreterFirstName(),
        consultation.getInterpreterLastName());
  }

  public static Consultation mapConsultationToDomain(ConsultationDto dto) {
    ConsultationParagraph7Dto paragraph7 = dto.paragraph7();
    ConsultationParagraph10Dto paragraph10 = dto.paragraph10();
    Consultation consultation = new Consultation();
    consultation.setLegalAdvices(paragraph7.legalAdvices());
    consultation.setHealthAndSocialInsurance(paragraph7.healthAndSocialInsurance());
    consultation.setConsultingServices(paragraph7.consultingServices());
    consultation.setEmergencyHelp(paragraph7.emergencyHelp());
    consultation.setTaxLiability(paragraph7.taxLiability());
    consultation.setInformationMaterial(paragraph7.informationMaterial());
    consultation.setPredicament(paragraph7.predicament());
    consultation.setDiseasePrevention(paragraph10.diseasePrevention());
    consultation.setBirthControl(paragraph10.birthControl());
    consultation.setPregnancy(paragraph10.pregnancy());
    consultation.setAlcoholAndDrugUsage(paragraph10.alcoholAndDrugUsage());
    consultation.setReferral(paragraph10.referral());
    consultation.setClearing(paragraph10.clearing());
    consultation.setLanguageOfConsultation(mapLanguage(dto.languageOfConsultation()));
    consultation.setInterpreterConsulted(dto.interpreterConsulted());
    consultation.setInterpreterFirstName(dto.interpreterFirstName());
    consultation.setInterpreterLastName(dto.interpreterLastName());
    return consultation;
  }

  private static DocumentTypeDto mapToDocumentTypeDto(DocumentType documentType) {
    return switch (documentType) {
      case null -> null;
      case DocumentType.IDENTIFICATION_CARD -> DocumentTypeDto.IDENTIFICATION_CARD;
      case DocumentType.PASSPORT -> DocumentTypeDto.PASSPORT;
      case DocumentType.RESIDENCE_PERMIT -> DocumentTypeDto.RESIDENCE_PERMIT;
      case DocumentType.TOLERANCE_PERMIT -> DocumentTypeDto.TOLERANCE_PERMIT;
      case DocumentType.OTHER -> DocumentTypeDto.OTHER;
    };
  }

  private static DocumentType mapDocumentType(DocumentTypeDto documentTypeDto) {
    return switch (documentTypeDto) {
      case null -> null;
      case DocumentTypeDto.IDENTIFICATION_CARD -> DocumentType.IDENTIFICATION_CARD;
      case DocumentTypeDto.PASSPORT -> DocumentType.PASSPORT;
      case DocumentTypeDto.RESIDENCE_PERMIT -> DocumentType.RESIDENCE_PERMIT;
      case DocumentTypeDto.TOLERANCE_PERMIT -> DocumentType.TOLERANCE_PERMIT;
      case DocumentTypeDto.OTHER -> DocumentType.OTHER;
    };
  }

  public static List<Language> mapLanguages(List<LanguageDto> languageDtos) {
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
        procedure.getVersion(),
        procedure.getPersonalData().getAlias(),
        mapLanguagesToInterfaceType(procedure),
        mapProcedureTypeToDto(procedure.getProcedureType()),
        procedure.getAppointmentStart(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        procedure.getCreatedAt(),
        procedure.getModifiedAt());
  }

  public static ProstituteProtectionProcedureSearchOverviewDto mapProcedureToSearchOverviewDto(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto decryptedPersonalData,
      String creatorName,
      String consultantName) {
    return new ProstituteProtectionProcedureSearchOverviewDto(
        procedure.getExternalId(),
        decryptedPersonalData.firstName(),
        decryptedPersonalData.lastName(),
        procedure.getPersonalData().getAlias(),
        decryptedPersonalData.dateOfBirth(),
        creatorName,
        consultantName,
        mapProcedureTypeToDto(procedure.getProcedureType()),
        procedure.getAppointmentStart(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()));
  }

  private static List<LanguageDto> mapLanguagesToInterfaceType(
      ProstituteProtectionProcedure procedure) {
    return procedure.getPersonalData().getLanguages().stream()
        .map(ProstituteProtectionMapper::mapToLanguageDto)
        .toList();
  }

  public static EncryptedFileOverviewDto mapEncryptedFileToOverviewDto(
      EncryptedFile encryptedFile) {
    return new EncryptedFileOverviewDto(
        encryptedFile.getExternalId(),
        encryptedFile.getCreatedAt(),
        encryptedFile.getValidUntil(),
        encryptedFile.getWithAlias(),
        encryptedFile.getCertificateType());
  }
}
