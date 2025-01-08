/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.medicalregistry.api.ApplicantDto;
import de.eshg.medicalregistry.api.GetProcedureConfirmedResponse;
import de.eshg.medicalregistry.api.GetProcedureDraftResponse;
import de.eshg.medicalregistry.api.GetProcedureResponse;
import de.eshg.medicalregistry.api.PracticeDto;
import de.eshg.medicalregistry.api.ProcedureTypeDto;
import de.eshg.medicalregistry.api.TypeOfApplicantChangeDto;
import de.eshg.medicalregistry.api.TypeOfChangeDto;
import de.eshg.medicalregistry.api.TypeOfFullChangeDto;
import de.eshg.medicalregistry.api.TypeOfPracticeChangeDto;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.MedicalRegistrySystemProgressEntryType;
import de.eshg.medicalregistry.domain.model.PartialMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.domain.model.TypeOfFullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.TypeOfPartialMedicalRegistryEntryChange;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class ProcedureMapper {
  private ProcedureMapper() {}

  public static GetProcedureResponse mapToDto(
      MedicalRegistryProcedure medicalRegistryProcedure,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, FacilityDetails> practiceDetails) {
    return switch (medicalRegistryProcedure) {
      case null -> null;
      case MedicalRegistryEntryChange draft ->
          mapToDraftDto(draft, professionalDetails, practiceDetails);
      case MedicalRegistryEntry confirmed ->
          mapToConfirmedDto(confirmed, professionalDetails, practiceDetails);
      default -> throw new IllegalStateException("Only medical registry entry or change can exist");
    };
  }

  public static GetProcedureDraftResponse mapToDraftDto(
      MedicalRegistryEntryChange medicalRegistryEntry,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, FacilityDetails> practiceDetails) {
    return switch (medicalRegistryEntry) {
      case FullMedicalRegistryEntryChange fullMedicalRegistryEntryChange ->
          mapToDraftDto(fullMedicalRegistryEntryChange, professionalDetails, practiceDetails);
      case PartialMedicalRegistryEntryChange partialMedicalRegistryEntryChange ->
          mapToDraftDto(partialMedicalRegistryEntryChange, professionalDetails, practiceDetails);
    };
  }

  public static GetProcedureDraftResponse mapToDraftDto(
      PartialMedicalRegistryEntryChange partialMedicalRegistryEntryChange,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, FacilityDetails> practiceDetails) {
    return new GetProcedureDraftResponse(
        partialMedicalRegistryEntryChange.getExternalId(),
        partialMedicalRegistryEntryChange.getVersion(),
        mapStatusToDto(partialMedicalRegistryEntryChange.getProcedureStatus()),
        mapProcedureTypeToDto(partialMedicalRegistryEntryChange.getProcedureType()),
        mapTypeOfChangeToDto(partialMedicalRegistryEntryChange.getTypeOfChange()),
        mapApplicant(partialMedicalRegistryEntryChange.getRelatedPersons(), professionalDetails),
        null,
        mapPractices(partialMedicalRegistryEntryChange.getRelatedFacilities(), practiceDetails),
        partialMedicalRegistryEntryChange.getEmployeesEmployed(),
        partialMedicalRegistryEntryChange.isConsentToPrivacyPolicy(),
        partialMedicalRegistryEntryChange.isRequestForWrittenConfirmation());
  }

  public static GetProcedureDraftResponse mapToDraftDto(
      FullMedicalRegistryEntryChange fullMedicalRegistryEntryChange,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, FacilityDetails> practiceDetails) {
    return new GetProcedureDraftResponse(
        fullMedicalRegistryEntryChange.getExternalId(),
        fullMedicalRegistryEntryChange.getVersion(),
        mapStatusToDto(fullMedicalRegistryEntryChange.getProcedureStatus()),
        mapProcedureTypeToDto(fullMedicalRegistryEntryChange.getProcedureType()),
        mapTypeOfChangeToDto(fullMedicalRegistryEntryChange.getTypeOfChange()),
        mapApplicant(fullMedicalRegistryEntryChange.getRelatedPersons(), professionalDetails),
        ProfessionalMapper.mapToDto(fullMedicalRegistryEntryChange.getProfessionInformation()),
        mapPractices(fullMedicalRegistryEntryChange.getRelatedFacilities(), practiceDetails),
        fullMedicalRegistryEntryChange.isEmployeesEmployed(),
        fullMedicalRegistryEntryChange.isConsentToPrivacyPolicy(),
        fullMedicalRegistryEntryChange.isRequestForWrittenConfirmation());
  }

  public static GetProcedureConfirmedResponse mapToConfirmedDto(
      MedicalRegistryEntry medicalRegistryProcedure,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, FacilityDetails> practiceDetails) {

    return new GetProcedureConfirmedResponse(
        medicalRegistryProcedure.getExternalId(),
        medicalRegistryProcedure.getVersion(),
        mapStatusToDto(medicalRegistryProcedure.getProcedureStatus()),
        mapProcedureTypeToDto(medicalRegistryProcedure.getProcedureType()),
        mapApplicant(medicalRegistryProcedure.getRelatedPersons(), professionalDetails),
        ProfessionalMapper.mapToDto(medicalRegistryProcedure.getProfessionInformation()),
        mapPractices(medicalRegistryProcedure.getRelatedFacilities(), practiceDetails),
        medicalRegistryProcedure.isEmployeesEmployed(),
        medicalRegistryProcedure.isConsentToPrivacyPolicy(),
        medicalRegistryProcedure.isRequestForWrittenConfirmation());
  }

  public static TypeOfPartialMedicalRegistryEntryChange mapToDomain(
      TypeOfApplicantChangeDto typeOfDeregistrationDto) {
    return switch (typeOfDeregistrationDto) {
      case RELOCATION -> TypeOfPartialMedicalRegistryEntryChange.RELOCATION;
      case DEREGISTRATION -> TypeOfPartialMedicalRegistryEntryChange.DEREGISTRATION;
      case CHANGE_OF_NAME -> TypeOfPartialMedicalRegistryEntryChange.CHANGE_OF_NAME;
    };
  }

  public static TypeOfPartialMedicalRegistryEntryChange mapToDomain(
      TypeOfPracticeChangeDto typeOfPracticeChangeDto) {
    return switch (typeOfPracticeChangeDto) {
      case CHANGE_OF_REGISTRATION -> TypeOfPartialMedicalRegistryEntryChange.CHANGE_OF_REGISTRATION;
      case SECOND_PRACTICE -> TypeOfPartialMedicalRegistryEntryChange.SECOND_PRACTICE;
    };
  }

  private static ApplicantDto mapApplicant(
      List<Professional> persons, GetPersonFileStateResponse professionalDetails) {
    Professional professional = persons.stream().collect(StreamUtil.toSingleElement());
    return ProfessionalMapper.mapToDto(professional, professionalDetails);
  }

  private static List<PracticeDto> mapPractices(
      List<Practice> facilities, Map<UUID, FacilityDetails> practiceDetails) {
    return facilities.stream()
        .map(p -> PracticeMapper.mapToDto(p, practiceDetails.get(p.getCentralFileStateId())))
        .toList();
  }

  public static TypeOfFullMedicalRegistryEntryChange mapToDomain(
      TypeOfFullChangeDto typeOfChangeDto) {
    if (typeOfChangeDto == null) {
      return null;
    }

    return switch (typeOfChangeDto) {
      case NEW_REGISTRATION -> TypeOfFullMedicalRegistryEntryChange.NEW_REGISTRATION;
      case RE_REGISTRATION -> TypeOfFullMedicalRegistryEntryChange.RE_REGISTRATION;
      case OTHER -> TypeOfFullMedicalRegistryEntryChange.OTHER;
    };
  }

  private static TypeOfChangeDto mapTypeOfChangeToDto(TypeOfChange typeOfChange) {
    return switch (typeOfChange) {
      case NEW_REGISTRATION -> TypeOfChangeDto.NEW_REGISTRATION;
      case SECOND_PRACTICE -> TypeOfChangeDto.SECOND_PRACTICE;
      case RE_REGISTRATION -> TypeOfChangeDto.RE_REGISTRATION;
      case CHANGE_OF_REGISTRATION -> TypeOfChangeDto.CHANGE_OF_REGISTRATION;
      case CHANGE_OF_NAME -> TypeOfChangeDto.CHANGE_OF_NAME;
      case RELOCATION -> TypeOfChangeDto.RELOCATION;
      case DEREGISTRATION -> TypeOfChangeDto.DEREGISTRATION;
      case OTHER -> TypeOfChangeDto.OTHER;
    };
  }

  public static ProcedureStatusDto mapStatusToDto(ProcedureStatus procedureStatus) {
    return de.eshg.lib.procedure.mapping.ProcedureMapper.toInterfaceType(procedureStatus);
  }

  public static ProcedureTypeDto mapProcedureTypeToDto(ProcedureType procedureType) {
    return switch (procedureType) {
      case MEDICAL_REGISTRY_ENTRY -> ProcedureTypeDto.MEDICAL_REGISTRY_ENTRY;
      case MEDICAL_REGISTRY_CITIZEN_DRAFT -> ProcedureTypeDto.MEDICAL_REGISTRY_CITIZEN_DRAFT;
      case MEDICAL_REGISTRY_EMPLOYEE_DRAFT -> ProcedureTypeDto.MEDICAL_REGISTRY_EMPLOYEE_DRAFT;
      default ->
          throw new IllegalStateException(
              "Only medical registry entry types can occur on medical registry procedures");
    };
  }

  public static MedicalRegistrySystemProgressEntryType mapToSystemProgressEntryType(
      TypeOfChange typeOfChange) {
    return switch (typeOfChange) {
      case NEW_REGISTRATION -> MedicalRegistrySystemProgressEntryType.NEW_REGISTRATION;
      case SECOND_PRACTICE -> MedicalRegistrySystemProgressEntryType.SECOND_PRACTICE;
      case RE_REGISTRATION -> MedicalRegistrySystemProgressEntryType.RE_REGISTRATION;
      case CHANGE_OF_REGISTRATION -> MedicalRegistrySystemProgressEntryType.CHANGE_OF_REGISTRATION;
      case CHANGE_OF_NAME -> MedicalRegistrySystemProgressEntryType.CHANGE_OF_NAME;
      case RELOCATION -> MedicalRegistrySystemProgressEntryType.RELOCATION;
      case DEREGISTRATION -> MedicalRegistrySystemProgressEntryType.DEREGISTRATION;
      case OTHER -> MedicalRegistrySystemProgressEntryType.OTHER;
    };
  }
}
