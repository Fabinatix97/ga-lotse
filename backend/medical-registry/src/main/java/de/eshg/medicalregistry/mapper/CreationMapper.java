/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.medicalregistry.api.CreateApplicantChangeRequest;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreateEmployeeChangeDto;
import de.eshg.medicalregistry.api.CreateEmployeeChangeRequest;
import de.eshg.medicalregistry.api.CreateFullChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.CreateProfessionInformationDto;
import de.eshg.medicalregistry.api.EmployeeChangeTypeDto;
import de.eshg.medicalregistry.domain.model.EmployeeChange;
import de.eshg.medicalregistry.domain.model.EmployeeChangeType;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.PartialMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.TypeOfPartialMedicalRegistryEntryChange;
import de.eshg.medicalregistry.importer.MedicalRegistryRow;
import java.util.List;
import java.util.UUID;
import org.springframework.data.util.StreamUtils;

public final class CreationMapper {

  private CreationMapper() {}

  public static MedicalRegistryEntryChange mapToDomain(
      CreateProcedureRequest request,
      TriggerType triggerType,
      UUID applicantPersonId,
      List<UUID> employeeChangePersonIds,
      UUID facilityId) {
    return switch (request) {
      case CreateFullChangeRequest createFullChangeRequest ->
          mapToDomain(createFullChangeRequest, triggerType, applicantPersonId, facilityId);
      case CreateApplicantChangeRequest createApplicantChangeRequest ->
          mapToDomain(createApplicantChangeRequest, triggerType, applicantPersonId);
      case CreatePracticeChangeRequest createPracticeChangeRequest ->
          mapToDomain(createPracticeChangeRequest, triggerType, applicantPersonId, facilityId);
      case CreateEmployeeChangeRequest createEmployeeChangeRequest ->
          mapToDomain(
              createEmployeeChangeRequest, triggerType, applicantPersonId, employeeChangePersonIds);
    };
  }

  private static PartialMedicalRegistryEntryChange mapToDomain(
      CreateEmployeeChangeRequest request,
      TriggerType triggerType,
      UUID applicantPersonId,
      List<UUID> employeeChangePersonIds) {
    PartialMedicalRegistryEntryChange medicalRegistryEntry =
        new PartialMedicalRegistryEntryChange(triggerType);
    medicalRegistryEntry.setTypeOfPartialChange(
        TypeOfPartialMedicalRegistryEntryChange.CHANGE_OF_EMPLOYEES);

    StreamUtils.zip(
            request.employeeChanges().stream(),
            employeeChangePersonIds.stream(),
            CreationMapper::mapToDomain)
        .forEach(medicalRegistryEntry::addRelatedPerson);

    mapCommonFields(medicalRegistryEntry, request, applicantPersonId);
    return medicalRegistryEntry;
  }

  private static EmployeeChange mapToDomain(
      CreateEmployeeChangeDto employeeChange, UUID employeeChangePersonId) {
    EmployeeChange employeeChangeEntity = new EmployeeChange();
    employeeChangeEntity.setEmployeeChangeType(mapToDomain(employeeChange.changeType()));
    employeeChangeEntity.setCentralFileStateId(employeeChangePersonId);
    return employeeChangeEntity;
  }

  private static EmployeeChangeType mapToDomain(EmployeeChangeTypeDto changeType) {
    return switch (changeType) {
      case ADD -> EmployeeChangeType.ADD;
      case REMOVE -> EmployeeChangeType.REMOVE;
    };
  }

  public static PartialMedicalRegistryEntryChange mapToDomain(
      CreateApplicantChangeRequest request, TriggerType triggerType, UUID personId) {
    PartialMedicalRegistryEntryChange medicalRegistryEntry =
        new PartialMedicalRegistryEntryChange(triggerType);
    medicalRegistryEntry.setTypeOfPartialChange(
        ProcedureMapper.mapToDomain(request.typeOfApplicantChange()));
    mapCommonFields(medicalRegistryEntry, request, personId);
    return medicalRegistryEntry;
  }

  public static PartialMedicalRegistryEntryChange mapToDomain(
      CreatePracticeChangeRequest request,
      TriggerType triggerType,
      UUID personId,
      UUID facilityId) {
    PartialMedicalRegistryEntryChange medicalRegistryEntry =
        new PartialMedicalRegistryEntryChange(triggerType);
    mapCommonFields(medicalRegistryEntry, request, personId);

    medicalRegistryEntry.setTypeOfPartialChange(
        ProcedureMapper.mapToDomain(request.typeOfPracticeChange()));
    medicalRegistryEntry.addRelatedFacility(buildPractice(request.practice(), facilityId));
    return medicalRegistryEntry;
  }

  public static FullMedicalRegistryEntryChange mapToDomain(
      CreateFullChangeRequest request, TriggerType triggerType, UUID personId, UUID facilityId) {
    FullMedicalRegistryEntryChange medicalRegistryEntry =
        new FullMedicalRegistryEntryChange(triggerType);
    mapCommonFields(medicalRegistryEntry, request, personId);

    medicalRegistryEntry.setTypeOfFullChange(
        ProcedureMapper.mapToDomain(request.typeOfFullChange()));
    ProfessionInformation professionInformation =
        buildProfessionInformation(request.professionInformation());
    medicalRegistryEntry.setProfessionInformation(professionInformation);

    if (facilityId != null) {
      medicalRegistryEntry.addRelatedFacility(buildPractice(request.practice(), facilityId));
    }
    return medicalRegistryEntry;
  }

  public static MedicalRegistryEntry mapToDomain(
      MedicalRegistryRow rowValue, UUID professionalId, UUID practiceId) {
    MedicalRegistryEntry medicalRegistryEntry =
        new MedicalRegistryEntry(TriggerType.SYSTEM_AUTOMATIC);
    medicalRegistryEntry.setConsentToPrivacyPolicy(true);
    medicalRegistryEntry.setRequestForWrittenConfirmation(false);
    ProfessionInformation professionInformation =
        buildProfessionInformation(rowValue.getProfessionInformation());
    medicalRegistryEntry.setProfessionInformation(professionInformation);

    medicalRegistryEntry.addRelatedPerson(
        buildProfessional(rowValue.getApplicant(), professionalId));
    if (practiceId != null) {
      medicalRegistryEntry.addRelatedFacility(buildPractice(rowValue.getPractice(), practiceId));
    }

    medicalRegistryEntry.setProcedureType(ProcedureType.MEDICAL_REGISTRY_ENTRY);
    return medicalRegistryEntry;
  }

  private static void mapCommonFields(
      MedicalRegistryEntryChange entryChange, CreateProcedureRequest request, UUID personId) {
    entryChange.setConsentToPrivacyPolicy(request.consentToPrivacyPolicy());
    entryChange.setRequestForWrittenConfirmation(request.requestForWrittenConfirmation());
    entryChange.addRelatedPerson(buildProfessional(request.applicant(), personId));
  }

  private static ProfessionInformation buildProfessionInformation(
      CreateProfessionInformationDto professional) {
    ProfessionInformation professionInformation = new ProfessionInformation();
    professionInformation.setProfessionalTitle(
        PersonMapper.mapToDomain(professional.getProfessionalTitle()));
    professionInformation.setFieldOfExpertise(professional.getFieldOfExpertise());
    professionInformation.setSpecialistTitle(professional.getSpecialistTitle());
    professionInformation.setFurtherTraining(professional.getFurtherTraining());
    professionInformation.setQualifications(professional.getQualifications());
    professionInformation.setLifetimeDoctorNumber(professional.getLifetimeDoctorNumber());
    professionInformation.setApprobationGrantedOn(professional.getApprobationGrantedOn());
    professionInformation.setApprobationIssuingAuthority(
        professional.getApprobationIssuingAuthority());
    professionInformation.setEmploymentType(
        PersonMapper.mapToDomain(professional.getEmploymentType()));
    professionInformation.setEmploymentStatus(
        PersonMapper.mapToDomain(professional.getEmploymentStatus()));
    return professionInformation;
  }

  private static Professional buildProfessional(
      CreateApplicantDto applicant, UUID centralFilePersonId) {
    Professional professionalEntity = new Professional();
    professionalEntity.setCentralFileStateId(centralFilePersonId);
    professionalEntity.setNationality(applicant.getNationality());
    return professionalEntity;
  }

  private static Practice buildPractice(CreatePracticeDto practice, UUID centralFileFacilityId) {
    Practice practiceEntity = new Practice();
    practiceEntity.setCentralFileStateId(centralFileFacilityId);
    practiceEntity.setWebsite(practice.getWebsite());
    practiceEntity.setInstitutionIdentifier(practice.getInstitutionIdentifier());
    practiceEntity.setEstablishmentNumber(practice.getEstablishmentNumber());
    practiceEntity.setHealthInsuranceAuthorization(practice.getHealthInsuranceAuthorization());
    practiceEntity.setOpeningHours(practice.getOpeningHours());

    return practiceEntity;
  }
}
