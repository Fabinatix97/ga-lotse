/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreateDeregistrationProcedureRequest;
import de.eshg.medicalregistry.api.CreateFullProcedureChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.CreateProfessionInformationDto;
import de.eshg.medicalregistry.domain.model.Deregistration;
import de.eshg.medicalregistry.domain.model.FullProcedureChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.importer.MedicalRegistryRowValues;
import java.util.UUID;

public final class CreationMapper {

  private CreationMapper() {}

  public static MedicalRegistryEntryChange mapToDomain(
      CreateProcedureRequest request, TriggerType triggerType, UUID personId, UUID facilityId) {
    return switch (request) {
      case CreateFullProcedureChangeRequest createFullProcedureChangeRequest ->
          mapToDomain(createFullProcedureChangeRequest, triggerType, personId, facilityId);
      case CreateDeregistrationProcedureRequest createDeregistrationProcedureRequest ->
          mapToDomain(createDeregistrationProcedureRequest, triggerType, personId);
    };
  }

  public static Deregistration mapToDomain(
      CreateDeregistrationProcedureRequest request, TriggerType triggerType, UUID personId) {
    Deregistration medicalRegistryEntry = new Deregistration(triggerType);
    medicalRegistryEntry.setTypeOfDeregistration(
        ProcedureMapper.mapToDomain(request.typeOfDeRegistration()));
    mapCommonFields(medicalRegistryEntry, request, personId);
    return medicalRegistryEntry;
  }

  public static FullProcedureChange mapToDomain(
      CreateFullProcedureChangeRequest request,
      TriggerType triggerType,
      UUID personId,
      UUID facilityId) {
    FullProcedureChange medicalRegistryEntry = new FullProcedureChange(triggerType);
    mapCommonFields(medicalRegistryEntry, request, personId);

    medicalRegistryEntry.setTypeOfFullProcedureChange(
        ProcedureMapper.mapToDomain(request.typeOfFullProcedureChange()));
    medicalRegistryEntry.setEmployeesEmployed(request.employeesEmployed());
    ProfessionInformation professionInformation =
        buildProfessionInformation(request.professionInformation());
    medicalRegistryEntry.setProfessionInformation(professionInformation);

    if (facilityId != null) {
      medicalRegistryEntry.addRelatedFacility(buildPractice(request.practice(), facilityId));
    }
    return medicalRegistryEntry;
  }

  public static MedicalRegistryEntry mapToDomain(
      MedicalRegistryRowValues rowValue, UUID professionalId, UUID practiceId) {
    MedicalRegistryEntry medicalRegistryEntry =
        new MedicalRegistryEntry(TriggerType.SYSTEM_AUTOMATIC);
    medicalRegistryEntry.setConsentToPrivacyPolicy(true);
    medicalRegistryEntry.setEmployeesEmployed(rowValue.getEmployeesEmployed());
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
        ProfessionalMapper.mapToDomain(professional.getProfessionalTitle()));
    professionInformation.setFieldOfExpertise(professional.getFieldOfExpertise());
    professionInformation.setSpecialistTitle(professional.getSpecialistTitle());
    professionInformation.setFurtherTraining(professional.getFurtherTraining());
    professionInformation.setQualifications(professional.getQualifications());
    professionInformation.setLifetimeDoctorNumber(professional.getLifetimeDoctorNumber());
    professionInformation.setApprobationGrantedOn(professional.getApprobationGrantedOn());
    professionInformation.setApprobationIssuingAuthority(
        professional.getApprobationIssuingAuthority());
    professionInformation.setEmploymentType(
        ProfessionalMapper.mapToDomain(professional.getEmploymentType()));
    professionInformation.setEmploymentStatus(
        ProfessionalMapper.mapToDomain(professional.getEmploymentStatus()));
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
