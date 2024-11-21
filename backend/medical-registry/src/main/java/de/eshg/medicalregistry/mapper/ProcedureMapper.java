/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.medicalregistry.api.*;
import de.eshg.medicalregistry.api.ProcedureTypeDto;
import de.eshg.medicalregistry.api.TypeOfChangeDto;
import de.eshg.medicalregistry.domain.model.*;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class ProcedureMapper {
  private ProcedureMapper() {}

  public static GetProcedureResponse mapToDto(
      MedicalRegistryEntry medicalRegistryEntry,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, GetFacilityFileStateResponse> practiceDetails) {
    return switch (medicalRegistryEntry) {
      case null -> null;
      case MedicalRegistryEntryChange draft ->
          mapToDraftDto(draft, professionalDetails, practiceDetails);
      case MedicalRegistryEntry confirmed ->
          mapToConfirmedDto(confirmed, professionalDetails, practiceDetails);
    };
  }

  public static GetProcedureDraftResponse mapToDraftDto(
      MedicalRegistryEntryChange medicalRegistryEntry,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, GetFacilityFileStateResponse> practiceDetails) {

    return new GetProcedureDraftResponse(
        medicalRegistryEntry.getExternalId(),
        medicalRegistryEntry.getVersion(),
        mapStatusToDto(medicalRegistryEntry.getProcedureStatus()),
        mapProcedureTypeToDto(medicalRegistryEntry.getProcedureType()),
        mapTypeOfChangeToDto(medicalRegistryEntry.getTypeOfChange()),
        mapProfessional(medicalRegistryEntry.getRelatedPersons(), professionalDetails),
        mapPractices(medicalRegistryEntry.getRelatedFacilities(), practiceDetails),
        medicalRegistryEntry.isEmployeesEmployed(),
        medicalRegistryEntry.isConsentToPrivacyPolicy(),
        medicalRegistryEntry.isRequestForWrittenConfirmation());
  }

  public static GetProcedureConfirmedResponse mapToConfirmedDto(
      MedicalRegistryEntry medicalRegistryEntry,
      GetPersonFileStateResponse professionalDetails,
      Map<UUID, GetFacilityFileStateResponse> practiceDetails) {

    return new GetProcedureConfirmedResponse(
        medicalRegistryEntry.getExternalId(),
        medicalRegistryEntry.getVersion(),
        mapStatusToDto(medicalRegistryEntry.getProcedureStatus()),
        mapProcedureTypeToDto(medicalRegistryEntry.getProcedureType()),
        mapProfessional(medicalRegistryEntry.getRelatedPersons(), professionalDetails),
        mapPractices(medicalRegistryEntry.getRelatedFacilities(), practiceDetails),
        medicalRegistryEntry.isEmployeesEmployed(),
        medicalRegistryEntry.isConsentToPrivacyPolicy(),
        medicalRegistryEntry.isRequestForWrittenConfirmation());
  }

  private static ProfessionalDto mapProfessional(
      List<Professional> persons, GetPersonFileStateResponse professionalDetails) {
    Professional professional = persons.stream().collect(StreamUtil.toSingleElement());
    return ProfessionalMapper.mapToDto(professional, professionalDetails);
  }

  private static List<PracticeDto> mapPractices(
      List<Practice> facilities, Map<UUID, GetFacilityFileStateResponse> practiceDetails) {
    return facilities.stream()
        .map(p -> PracticeMapper.mapToDto(p, practiceDetails.get(p.getCentralFileStateId())))
        .toList();
  }

  public static TypeOfChange mapToDomain(TypeOfChangeDto typeOfChangeDto) {
    if (typeOfChangeDto == null) {
      return null;
    }

    return switch (typeOfChangeDto) {
      case NEW_REGISTRATION -> TypeOfChange.NEW_REGISTRATION;
      case SECOND_PRACTICE -> TypeOfChange.SECOND_PRACTICE;
      case RE_REGISTRATION -> TypeOfChange.RE_REGISTRATION;
      case CHANGE_OF_REGISTRATION -> TypeOfChange.CHANGE_OF_REGISTRATION;
      case CHANGE_OF_NAME -> TypeOfChange.CHANGE_OF_NAME;
      case RELOCATION -> TypeOfChange.RELOCATION;
      case DEREGISTRATION -> TypeOfChange.DEREGISTRATION;
      case OTHER -> TypeOfChange.OTHER;
    };
  }

  private static TypeOfChangeDto mapTypeOfChangeToDto(TypeOfChange typeOfChange) {
    if (typeOfChange == null) {
      return null;
    }

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
