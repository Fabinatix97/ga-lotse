/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.lib.procedure.mapping.FacilityTypeMapper.*;
import static de.eshg.medicalregistry.mapper.ProfessionalMapper.*;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.medicalregistry.api.*;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.registry.MedicalRegistryEntryRepository;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.stereotype.Service;

@Service
public class MedicalRegistryService {

  private final MedicalRegistryEntryRepository medicalRegistryEntryRepository;
  private final PersonApi personApi;
  private final FacilityApi facilityApi;
  private final AuditLogger auditLogger;
  private final Clock clock;

  public MedicalRegistryService(
      MedicalRegistryEntryRepository medicalRegistryEntryRepository,
      PersonApi personApi,
      FacilityApi facilityApi,
      AuditLogger auditLogger,
      Clock clock) {
    this.medicalRegistryEntryRepository = medicalRegistryEntryRepository;
    this.personApi = personApi;
    this.facilityApi = facilityApi;
    this.auditLogger = auditLogger;
    this.clock = clock;
  }

  public MedicalRegistryEntry findProcedureByExternalId(UUID procedureId) {
    return medicalRegistryEntryRepository
        .findByExternalId(procedureId)
        .orElseThrow(notFoundException(procedureId));
  }

  private static Supplier<NotFoundException> notFoundException(UUID procedureId) {
    return () ->
        new NotFoundException(
            "%s with UUID %s not found"
                .formatted(MedicalRegistryEntry.class.getSimpleName(), procedureId));
  }

  public GetPersonFileStateResponse findProfessionalDetails(UUID externalId) {
    return personApi.getPersonFileState(externalId);
  }

  public GetFacilityFileStateResponse findPracticeDetails(UUID externalId) {
    return facilityApi.getFacilityFileState(externalId);
  }

  public MedicalRegistryEntry createProcedure(CreateProcedureRequest request) {
    CreateProcedureDto procedure = request.procedure();
    ProfessionalDto professional = procedure.professional();
    PracticeDto practice = procedure.practice();

    MedicalRegistryEntry medicalRegistryEntry = new MedicalRegistryEntry();
    medicalRegistryEntry.setConsentToPrivacyPolicy(procedure.consentToPrivacyPolicy());
    medicalRegistryEntry.setEmployeesEmployed(procedure.employeesEmployed());
    medicalRegistryEntry.setRequestForWrittenConfirmation(
        procedure.requestForWrittenConfirmation());

    UUID personId = createPersonInCentralFile(professional);

    Professional professionalEntity = new Professional();
    professionalEntity.setCentralFileStateId(personId);
    professionalEntity.setProfessionalTitle(mapToDomain(professional.professionalTitle()));
    professionalEntity.setFieldOfExpertise(professional.fieldOfExpertise());
    professionalEntity.setSpecialistTitle(professional.specialistTitle());
    professionalEntity.setFurtherTraining(professional.furtherTraining());
    professionalEntity.setQualifications(professional.qualifications());
    professionalEntity.setLifetimeDoctorNumber(professional.lifetimeDoctorNumber());
    professionalEntity.setApprobationGrantedOn(professional.approbationGrantedOn());
    professionalEntity.setApprobationIssuingAuthority(professional.approbationIssuingAuthority());
    professionalEntity.setEmploymentType(mapToDomain(professional.employmentType()));
    professionalEntity.setEmploymentStatus(mapToDomain(professional.employmentStatus()));
    professionalEntity.setNationality(professional.nationality());
    medicalRegistryEntry.addRelatedPerson(professionalEntity);

    if (practice != null) {
      UUID facilityExternalId = createFacilityInCentralFile(practice);

      Practice practiceEntity = new Practice();
      practiceEntity.setCentralFileStateId(facilityExternalId);
      practiceEntity.setWebsite(practice.website());
      practiceEntity.setInstitutionIdentifier(practice.institutionIdentifier());
      practiceEntity.setEstablishmentNumber(practice.establishmentNumber());
      practiceEntity.setHealthInsuranceAuthorization(practice.healthInsuranceAuthorization());
      practiceEntity.setOpeningHours(practice.openingHours());
      medicalRegistryEntry.addRelatedFacility(practiceEntity);
    }

    medicalRegistryEntry.setProcedureType(ProcedureType.MEDICAL_REGISTRY_CITIZEN_DRAFT);
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    return medicalRegistryEntryRepository.save(medicalRegistryEntry);
  }

  private UUID createPersonInCentralFile(ProfessionalDto professional) {
    AddPersonFileStateResponse addPersonResponse =
        personApi.addPersonFileState(
            new AddPersonFileStateRequest(
                null,
                professional.title(),
                null,
                professional.gender(),
                professional.firstName(),
                professional.lastName(),
                professional.dateOfBirth(),
                professional.nameAtBirth(),
                professional.placeOfBirth(),
                null,
                toList(professional.emailAddress()),
                toList(professional.phoneNumber()),
                mapAddress(professional.address()),
                null,
                DataOriginDto.MANUAL));

    return addPersonResponse.id();
  }

  private UUID createFacilityInCentralFile(PracticeDto practice) {
    AddFacilityFileStateResponse addFacilityResponse =
        facilityApi.addFacilityFileState(
            new AddFacilityFileStateRequest(
                null,
                practice.name(),
                toList(practice.emailAddress()),
                toList(practice.phoneNumber()),
                null,
                mapAddress(practice.address()),
                null,
                DataOriginDto.MANUAL,
                null));

    return addFacilityResponse.id();
  }

  private static DomesticAddressDto mapAddress(AddressDto address) {
    if (address == null) {
      return null;
    }

    return new DomesticAddressDto(
        CountryCode.DE,
        address.city(),
        address.postalCode(),
        null,
        address.street(),
        address.houseNumber(),
        null);
  }

  private static List<String> toList(String value) {
    return value == null ? List.of() : List.of(value);
  }
}
